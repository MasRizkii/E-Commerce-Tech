"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Save,
  ShoppingBag,
  Star,
} from "lucide-react";

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
  stats: {
    totalOrders: number;
    reviewsAdded: number;
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
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4778e6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3868d5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="size-4" />
          Save
        </>
      )}
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-600">{errors[0]}</p>;
}

function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5 border-b border-slate-100 py-3 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-4 sm:py-3.5">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      {children}
    </div>
  );
}

const fieldInputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition focus:border-[#4778e6] focus:ring-2 focus:ring-[#4778e6]/20";

export function ProfileForm({ profile, stats }: ProfileFormProps) {
  const [state, formAction] = useActionState(
    updateProfileAction,
    initialState,
  );

  const username =
    profile.email.split("@")[0]?.toLowerCase() || "pengguna";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-50 text-[#4778e6]">
            <ShoppingBag className="size-5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">
              Total Orders
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-500">
            <Star className="size-5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500">
              Reviews Added
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {stats.reviewsAdded}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 px-6 py-5">
          <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        </div>

        <form action={formAction} className="p-6">
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
            <div>
              <ProfileField label="Username">
                <input
                  type="text"
                  value={username}
                  readOnly
                  className={`${fieldInputClasses} cursor-not-allowed bg-slate-50 text-slate-500`}
                />
              </ProfileField>

              <ProfileField label="Name">
                <div>
                  <input
                    name="name"
                    type="text"
                    defaultValue={profile.name}
                    placeholder="Masukkan nama lengkap"
                    className={fieldInputClasses}
                  />

                  <FieldError errors={state.errors?.name} />
                </div>
              </ProfileField>

              <ProfileField label="Email">
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className={`${fieldInputClasses} cursor-not-allowed bg-slate-50 text-slate-500`}
                />
              </ProfileField>

              <ProfileField label="Phone Number">
                <div>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={profile.phone}
                    placeholder="Contoh: 081234567890"
                    className={fieldInputClasses}
                  />

                  <FieldError errors={state.errors?.phone} />
                </div>
              </ProfileField>

              <ProfileField label="Birth Day">
                <input
                  name="birth_day"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  className={fieldInputClasses}
                />
              </ProfileField>

              <ProfileField label="Address">
                <div>
                  <textarea
                    name="address"
                    rows={3}
                    defaultValue={profile.address}
                    placeholder="Masukkan alamat lengkap"
                    className={`${fieldInputClasses} resize-none`}
                  />

                  <FieldError errors={state.errors?.address} />
                </div>
              </ProfileField>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 p-5 text-center">
              <div className="grid size-20 place-items-center rounded-full bg-slate-200 text-slate-400">
                <ImagePlus className="size-7" />
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-[#4778e6] hover:underline"
              >
                Pilih Gambar
              </button>

              <p className="text-xs leading-relaxed text-slate-400">
                Ukuran Gambar: maks. 5 MB
                <br />
                Format Gambar: JPG, .PNG
              </p>
            </div>
          </div>

          <div className="mt-7 flex justify-start">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
