-- =========================================================
-- PRODUCTS TABLE
-- =========================================================

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category text not null check (
    category in (
      'smartphone',
      'laptop',
      'desktop',
      'tablet',
      'accessories'
    )
  ),
  condition text not null default 'brand-new' check (
    condition in ('brand-new', 'second')
  ),
  price bigint not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image text not null default '',
  rating numeric(2, 1) not null default 0 check (
    rating >= 0 and rating <= 5
  ),
  sold integer not null default 0 check (sold >= 0),
  is_featured boolean not null default false,
  is_promo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- INDEX
-- =========================================================

create index if not exists products_slug_index
on public.products(slug);

create index if not exists products_category_index
on public.products(category);

create index if not exists products_created_at_index
on public.products(created_at desc);

create index if not exists products_price_index
on public.products(price);

-- =========================================================
-- UPDATED AT TRIGGER
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at
on public.products;

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.products enable row level security;

drop policy if exists "products can be viewed by everyone"
on public.products;

drop policy if exists "admins can insert products"
on public.products;

drop policy if exists "admins can update products"
on public.products;

drop policy if exists "admins can delete products"
on public.products;

create policy "products can be viewed by everyone"
on public.products
for select
to anon, authenticated
using (true);

create policy "admins can insert products"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

create policy "admins can update products"
on public.products
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

create policy "admins can delete products"
on public.products
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

-- =========================================================
-- SEED PRODUCTS
-- =========================================================

insert into public.products (
  name,
  slug,
  description,
  category,
  condition,
  price,
  stock,
  image,
  rating,
  sold,
  is_featured,
  is_promo,
  created_at
)
values
  (
    'iPhone 17 Pro Max',
    'iphone-17-pro-max',
    'iPhone premium dengan performa tinggi, kamera profesional, dan desain terbaru.',
    'smartphone',
    'brand-new',
    25499000,
    12,
    '/images/products/iphone-17-pro-max.png',
    4.9,
    86,
    true,
    true,
    now() - interval '1 day'
  ),
  (
    'iPhone 15 Pro',
    'iphone-15-pro',
    'iPhone 15 Pro dengan bodi titanium dan performa chip Apple yang cepat.',
    'smartphone',
    'brand-new',
    14999000,
    15,
    '/images/products/iphone-15-pro.png',
    4.8,
    120,
    true,
    false,
    now() - interval '15 days'
  ),
  (
    'iPhone 14 Pro',
    'iphone-14-pro',
    'iPhone 14 Pro second berkualitas dengan kondisi terawat.',
    'smartphone',
    'second',
    9499000,
    8,
    '/images/products/iphone-14-pro.png',
    4.7,
    98,
    true,
    true,
    now() - interval '30 days'
  ),
  (
    'iPhone 13',
    'iphone-13',
    'iPhone 13 dengan kamera ganda dan performa yang masih sangat responsif.',
    'smartphone',
    'second',
    5499000,
    11,
    '/images/products/iphone-13.png',
    4.6,
    145,
    false,
    false,
    now() - interval '45 days'
  ),
  (
    'iPhone 11',
    'iphone-11',
    'iPhone 11 second dengan performa stabil untuk penggunaan sehari-hari.',
    'smartphone',
    'second',
    3499000,
    18,
    '/images/products/iphone-11.png',
    4.5,
    210,
    true,
    true,
    now() - interval '60 days'
  ),
  (
    'MacBook Pro M4',
    'macbook-pro-m4',
    'MacBook Pro bertenaga chip M4 untuk pekerjaan kreatif dan profesional.',
    'laptop',
    'brand-new',
    25999000,
    10,
    '/images/products/macbook-pro-m4.png',
    4.9,
    64,
    true,
    false,
    now() - interval '2 days'
  ),
  (
    'MacBook Pro M2',
    'macbook-pro-m2',
    'MacBook Pro M2 dengan performa cepat dan daya tahan baterai panjang.',
    'laptop',
    'second',
    14999000,
    7,
    '/images/products/macbook-pro-m2.png',
    4.7,
    75,
    true,
    true,
    now() - interval '35 days'
  ),
  (
    'MacBook Air M3',
    'macbook-air-m3',
    'MacBook Air tipis dan ringan dengan performa chip M3.',
    'laptop',
    'brand-new',
    17999000,
    14,
    '/images/products/macbook-air-m3.png',
    4.8,
    92,
    false,
    false,
    now() - interval '10 days'
  ),
  (
    'MacBook Air M2',
    'macbook-air-m2',
    'Laptop ringan untuk kuliah, bekerja, dan kebutuhan produktivitas.',
    'laptop',
    'brand-new',
    13500000,
    16,
    '/images/products/macbook-air-m2.png',
    4.7,
    130,
    false,
    true,
    now() - interval '25 days'
  ),
  (
    'Mac Mini M4',
    'mac-mini-m4',
    'Desktop ringkas dengan chip M4 untuk setup kerja minimalis.',
    'desktop',
    'brand-new',
    10499000,
    9,
    '/images/products/mac-mini-m4.png',
    4.9,
    57,
    true,
    false,
    now() - interval '3 days'
  ),
  (
    'Mac Mini M2',
    'mac-mini-m2',
    'Mac Mini M2 ringkas dan efisien untuk produktivitas harian.',
    'desktop',
    'second',
    8500000,
    6,
    '/images/products/mac-mini-m2.png',
    4.6,
    42,
    false,
    true,
    now() - interval '40 days'
  ),
  (
    'iMac M3',
    'imac-m3',
    'Komputer all-in-one dengan layar tajam dan desain modern.',
    'desktop',
    'brand-new',
    24999000,
    5,
    '/images/products/imac-m3.png',
    4.8,
    35,
    false,
    false,
    now() - interval '20 days'
  ),
  (
    'iPad Air M2',
    'ipad-air-m2',
    'Tablet serbaguna untuk belajar, bekerja, desain, dan hiburan.',
    'tablet',
    'brand-new',
    10999000,
    13,
    '/images/products/ipad-air-m2.png',
    4.8,
    88,
    true,
    false,
    now() - interval '8 days'
  ),
  (
    'AirPods Pro 2',
    'airpods-pro-2',
    'Earbuds dengan active noise cancellation dan kualitas suara jernih.',
    'accessories',
    'brand-new',
    3799000,
    25,
    '/images/products/airpods-pro-2.png',
    4.9,
    240,
    false,
    true,
    now() - interval '12 days'
  ),
  (
    'Apple Watch Series 10',
    'apple-watch-series-10',
    'Smartwatch untuk memantau aktivitas, kesehatan, dan notifikasi.',
    'accessories',
    'brand-new',
    6499000,
    17,
    '/images/products/apple-watch-series-10.png',
    4.7,
    73,
    false,
    false,
    now() - interval '6 days'
  ),
  (
    'Magic Mouse',
    'magic-mouse',
    'Mouse wireless Apple dengan permukaan multi-touch.',
    'accessories',
    'brand-new',
    1599000,
    21,
    '/images/products/magic-mouse.png',
    4.5,
    110,
    false,
    false,
    now() - interval '50 days'
  )
on conflict (slug)
do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  condition = excluded.condition,
  price = excluded.price,
  stock = excluded.stock,
  image = excluded.image,
  rating = excluded.rating,
  sold = excluded.sold,
  is_featured = excluded.is_featured,
  is_promo = excluded.is_promo,
  updated_at = now();