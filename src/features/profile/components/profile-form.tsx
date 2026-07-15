"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, LoaderCircle, Save, UserRound } from "lucide-react";

import {
  updateProfileAction,
  type ProfileActionState,
} from "@/features/profile/actions";

type ProfileFormProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
  };
};

const initialState: ProfileActionState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
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
          Simpan perubahan
        </>
      )}
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialState,
  );

  const initial =
    profile.name.trim().charAt(0).toUpperCase() ||
    profile.email.trim().charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/10 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>

        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi akun dan alamat checkout kamu.
        </p>
      </div>

      <form action={formAction} className="p-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#4778e6] text-3xl font-bold text-white">
            {initial}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-slate-500" />

              <p className="font-semibold text-slate-900">
                {profile.name || "Pengguna Toko Mac"}
              </p>
            </div>

            <p className="mt-1 text-sm text-slate-500">{profile.email}</p>

            <span className="mt-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-[#4778e6]">
              {profile.role || "customer"}
            </span>
          </div>
        </div>

        {state.message ? (
          <div
            className={`mb-6 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              state.status === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.status === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : null}

            <span>{state.message}</span>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama lengkap
            </label>

            <input
              id="name"
              name="name"
              type="text"
              defaultValue={profile.name}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20"
            />

            <FieldError errors={state.errors?.name} />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
            />

            <p className="mt-1 text-xs text-slate-400">
              Email login tidak dapat diubah dari halaman ini.
            </p>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nomor telepon
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20"
            />

            <FieldError errors={state.errors?.phone} />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Alamat
            </label>

            <textarea
              id="address"
              name="address"
              rows={4}
              defaultValue={profile.address}
              placeholder="Masukkan alamat lengkap"
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20"
            />

            <FieldError errors={state.errors?.address} />
          </div>
        </div>

        <div className="mt-7 flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}