"use client";

import Link from "next/link";
import { 
    useActionState,
    useState,
} from "react";
import { useFormStatus } from "react-dom";
import { 
    LoaderCircle, 
    Save,
    Star,
} from "lucide-react";

import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/features/products/actions";
import { ProductImageUpload } from "@/features/products/components/product-image-upload";

export type EditableProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  stock: number;
  image: string;
  rating: number;
  sold: number;
  is_featured: boolean;
  is_promo: boolean;
};

type ProductFormProps = {
  product?: EditableProduct;
};

const initialState: ProductActionState = {
  status: "idle",
  message: "",
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-600">{errors[0]}</p>
  );
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4778e6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3868d5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="size-4" />
          {editing ? "Simpan perubahan" : "Tambah produk"}
        </>
      )}
    </button>
  );
}

function RatingField({
  initialRating,
  errors,
}: {
  initialRating: number;
  errors?: string[];
}) {
  const [rating, setRating] = useState(
    Math.min(5, Math.max(1, Math.round(initialRating))),
  );

  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-slate-700">
        Rating produk
      </p>

      <input
        type="hidden"
        name="rating"
        value={rating}
      />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            aria-label={`Beri rating ${star} bintang`}
            className="rounded p-1 transition hover:scale-110"
          >
            <Star
              className={`size-7 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-slate-300"
              }`}
            />
          </button>
        ))}

        <span className="ml-2 text-sm font-semibold text-slate-700">
          {rating}/5
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Pilih rating 1 sampai 5 bintang. Maksimal 5
        bintang.
      </p>

      <FieldError errors={errors} />
    </div>
  );
}

export function ProductForm({
  product,
}: ProductFormProps) {
  const editing = Boolean(product);

  const [imageUrl, setImageUrl] = useState(
  product?.image ?? "",
);

  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;

  const [state, formAction] = useActionState(
    action,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          {editing ? "Edit Produk" : "Tambah Produk"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Slug produk akan dibuat otomatis dari nama produk.
        </p>
      </div>

      <form action={formAction} className="p-6">
        {state.message ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama produk
            </label>

            <input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="Contoh: MacBook Pro M4"
              className={inputClassName}
            />

            <FieldError errors={state.errors?.name} />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Deskripsi
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={product?.description}
              placeholder="Jelaskan kondisi dan keunggulan produk"
              className={`${inputClassName} resize-none`}
            />

            <FieldError errors={state.errors?.description} />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Kategori
            </label>

            <select
              id="category"
              name="category"
              defaultValue={product?.category ?? "smartphone"}
              className={inputClassName}
            >
              <option value="smartphone">Smartphone</option>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="accessories">Accessories</option>
            </select>

            <FieldError errors={state.errors?.category} />
          </div>

          <div>
            <label
              htmlFor="condition"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Kondisi
            </label>

            <select
              id="condition"
              name="condition"
              defaultValue={product?.condition ?? "brand-new"}
              className={inputClassName}
            >
              <option value="brand-new">Brand New</option>
              <option value="second">Second</option>
            </select>

            <FieldError errors={state.errors?.condition} />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Harga
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              defaultValue={product?.price}
              placeholder="Contoh: 15999000"
              className={inputClassName}
            />

            <FieldError errors={state.errors?.price} />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Stock
            </label>

            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 0}
              className={inputClassName}
            />

            <FieldError errors={state.errors?.stock} />
          </div>

          <RatingField
            initialRating={product?.rating ?? 5}
            errors={state.errors?.rating}
          />

          <div>
            <label
              htmlFor="sold"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Jumlah terjual
            </label>

            <input
              id="sold"
              name="sold"
              type="number"
              min="0"
              defaultValue={product?.sold ?? 0}
              className={inputClassName}
            />

            <FieldError errors={state.errors?.sold} />
          </div>

        <div className="md:col-span-2">
          <p className="mb-2 block text-sm font-semibold text-slate-700">
            Foto produk
          </p>

          <input
            type="hidden"
            name="image"
            value={imageUrl}
          />

          <ProductImageUpload
          initialImage={product?.image}
          onImageChange={setImageUrl}
          />

          <FieldError errors={state.errors?.image} />
        </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={product?.is_featured}
              className="size-4 accent-[#4778e6]"
            />

            <span className="text-sm font-semibold text-slate-700">
              Featured product
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              name="isPromo"
              type="checkbox"
              defaultChecked={product?.is_promo}
              className="size-4 accent-[#4778e6]"
            />

            <span className="text-sm font-semibold text-slate-700">
              Produk promo
            </span>
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </Link>

          <SubmitButton editing={editing} />
        </div>
      </form>
    </div>
  );
}