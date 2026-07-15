import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { DeleteProductButton } from "@/features/products/components/delete-product-button";
import { formatCurrency } from "@/lib/format-currency";
import { createClient } from "@/lib/supabase/server";

type AdminProductsPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        category,
        condition,
        price,
        stock
      `,
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#4778e6]">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola produk yang tampil di halaman toko.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4778e6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3868d5]"
        >
          <Plus className="size-4" />
          Tambah produk
        </Link>
      </div>

      {params.success ? (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {params.success === "created"
            ? "Produk berhasil ditambahkan."
            : "Produk berhasil diperbarui."}
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Produk gagal dihapus.
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Data produk gagal dimuat.
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Produk</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Kondisi</th>
                <th className="px-5 py-4">Harga</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {products?.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {product.slug}
                    </p>
                  </td>

                  <td className="px-5 py-4 capitalize text-slate-600">
                    {product.category}
                  </td>

                  <td className="px-5 py-4 capitalize text-slate-600">
                    {product.condition.replace("-", " ")}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {formatCurrency(Number(product.price))}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#4778e6]"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Link>

                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {!products?.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    Belum ada produk.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}