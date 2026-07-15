-- =========================================================
-- ORDERS
-- =========================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (
    status in (
      'pending',
      'processing',
      'shipped',
      'completed',
      'cancelled'
    )
  ),
  customer_name text not null,
  customer_email text not null,
  phone text not null,
  shipping_address text not null,
  notes text,
  subtotal bigint not null check (subtotal >= 0),
  shipping_cost bigint not null default 0 check (shipping_cost >= 0),
  total bigint not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ORDER ITEMS
-- =========================================================

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text not null,
  product_image text not null default '',
  price bigint not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal bigint not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_index
on public.orders(user_id);

create index if not exists orders_created_at_index
on public.orders(created_at desc);

create index if not exists order_items_order_id_index
on public.order_items(order_id);

drop trigger if exists set_orders_updated_at
on public.orders;

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY: ORDERS
-- =========================================================

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "customers can view own orders"
on public.orders;

drop policy if exists "customers can create own orders"
on public.orders;

drop policy if exists "admins can update orders"
on public.orders;

create policy "customers can view own orders"
on public.orders
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "customers can create own orders"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "admins can update orders"
on public.orders
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- =========================================================
-- ROW LEVEL SECURITY: ORDER ITEMS
-- =========================================================

drop policy if exists "customers can view own order items"
on public.order_items;

drop policy if exists "customers can create own order items"
on public.order_items;

create policy "customers can view own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        orders.user_id = auth.uid()
        or exists (
          select 1
          from public.profiles
          where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
      )
  )
);

create policy "customers can create own order items"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant update on public.orders to authenticated;

-- =========================================================
-- TRANSACTIONAL MOCK CHECKOUT
-- =========================================================

create or replace function public.create_mock_order(
  p_customer_name text,
  p_customer_email text,
  p_phone text,
  p_shipping_address text,
  p_items jsonb,
  p_notes text
)
returns table (
  order_id uuid,
  order_number text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_item jsonb;
  v_product record;
  v_quantity integer;
  v_subtotal bigint := 0;
  v_shipping_cost bigint := 0;
  v_total bigint := 0;
  v_order_id uuid := gen_random_uuid();
  v_order_number text;
begin
  if v_user_id is null then
    raise exception 'Kamu harus login untuk checkout.';
  end if;

  if trim(coalesce(p_customer_name, '')) = '' then
    raise exception 'Nama penerima wajib diisi.';
  end if;

  if trim(coalesce(p_customer_email, '')) = '' then
    raise exception 'Email wajib diisi.';
  end if;

  if trim(coalesce(p_phone, '')) = '' then
    raise exception 'Nomor telepon wajib diisi.';
  end if;

  if trim(coalesce(p_shipping_address, '')) = '' then
    raise exception 'Alamat pengiriman wajib diisi.';
  end if;

  if p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) = 0
  then
    raise exception 'Keranjang masih kosong.';
  end if;

  -- Validasi produk dan hitung total berdasarkan harga database.
  for v_item in
    select value
    from jsonb_array_elements(p_items)
  loop
    begin
      v_quantity := (v_item ->> 'quantity')::integer;
    exception
      when others then
        raise exception 'Jumlah produk tidak valid.';
    end;

    if v_quantity is null or v_quantity < 1 then
      raise exception 'Jumlah produk minimal 1.';
    end if;

    select
      products.id,
      products.name,
      products.slug,
      products.image,
      products.price,
      products.stock
    into v_product
    from public.products
    where products.id::text = v_item ->> 'productId'
    for update;

    if not found then
      raise exception 'Produk pada keranjang tidak ditemukan.';
    end if;

    if v_product.stock < v_quantity then
      raise exception
        'Stock % tidak mencukupi. Tersedia %.',
        v_product.name,
        v_product.stock;
    end if;

    v_subtotal :=
      v_subtotal + (v_product.price * v_quantity);
  end loop;

  v_total := v_subtotal + v_shipping_cost;

  v_order_number :=
    'TM-' ||
    to_char(now(), 'YYYYMMDD') ||
    '-' ||
    upper(
      substr(
        replace(gen_random_uuid()::text, '-', ''),
        1,
        6
      )
    );

  insert into public.orders (
    id,
    order_number,
    user_id,
    status,
    customer_name,
    customer_email,
    phone,
    shipping_address,
    notes,
    subtotal,
    shipping_cost,
    total
  )
  values (
    v_order_id,
    v_order_number,
    v_user_id,
    'pending',
    trim(p_customer_name),
    trim(p_customer_email),
    trim(p_phone),
    trim(p_shipping_address),
    nullif(trim(coalesce(p_notes, '')), ''),
    v_subtotal,
    v_shipping_cost,
    v_total
  );

  -- Simpan snapshot item dan kurangi stock.
  for v_item in
    select value
    from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;

    select
      products.id,
      products.name,
      products.slug,
      products.image,
      products.price,
      products.stock
    into v_product
    from public.products
    where products.id::text = v_item ->> 'productId'
    for update;

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      product_slug,
      product_image,
      price,
      quantity,
      subtotal
    )
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.slug,
      v_product.image,
      v_product.price,
      v_quantity,
      v_product.price * v_quantity
    );

    update public.products
    set
      stock = stock - v_quantity,
      sold = sold + v_quantity
    where id = v_product.id;
  end loop;

  return query
  select v_order_id, v_order_number;
end;
$$;

revoke all
on function public.create_mock_order(
  text,
  text,
  text,
  text,
  jsonb,
  text
)
from public;

grant execute
on function public.create_mock_order(
  text,
  text,
  text,
  text,
  jsonb,
  text
)
to authenticated;