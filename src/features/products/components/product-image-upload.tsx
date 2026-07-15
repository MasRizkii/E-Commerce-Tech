"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import {
  ImagePlus,
  LoaderCircle,
  Upload,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

type ProductImageUploadProps = {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
};

function getFileExtension(file: File) {
  const mimeExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };

  return mimeExtensions[file.type] ?? "jpg";
}

export function ProductImageUpload({
  initialImage,
  onImageChange,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(
    initialImage ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage(
        "Format gambar harus JPG, PNG, WEBP, atau AVIF.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(
        "Ukuran gambar maksimal 50 MB.",
      );
      event.target.value = "";
      return;
    }

    setUploading(true);

    const supabase = createClient();
    const extension = getFileExtension(file);
    const filePath = `products/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload product image error:", error);
      setErrorMessage(
        "Gambar gagal di-upload. Pastikan akun memiliki role admin.",
      );
      setUploading(false);
      event.target.value = "";
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setPreview(data.publicUrl);
    onImageChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div
          className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 bg-contain bg-center bg-no-repeat"
          style={
            preview
              ? {
                  backgroundImage: `url("${preview}")`,
                }
              : undefined
          }
        >
          {!preview ? (
            <ImagePlus className="size-10 text-slate-400" />
          ) : null}
        </div>

        <div className="flex flex-col justify-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#4778e6] px-4 py-2.5 text-sm font-semibold text-[#4778e6] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Meng-upload...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                {preview ? "Ganti foto" : "Pilih foto"}
              </>
            )}
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            JPG, PNG, WEBP, atau AVIF. Maksimal 50 MB.
            Untuk performa website, disarankan kurang dari 6 MB.
          </p>

          {preview ? (
            <p className="mt-2 break-all text-xs text-green-600">
              Foto berhasil tersimpan.
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}