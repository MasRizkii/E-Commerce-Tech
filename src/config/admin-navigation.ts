import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Store,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";

export type AdminNavChild = {
  label: string;
  href: string;
  disabled?: boolean;
};

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: AdminNavChild[];
};

// Menu utama (disamakan dengan struktur desain, menu "Sales" dihapus
// karena toko ini hanya menjual untuk satu toko/single-tenant).
export const adminMainNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: ShoppingCart,
    children: [
      {
        label: "All Orders",
        href: "/account/orders",
      },
      {
        label: "Returns",
        href: "#",
        disabled: true,
      },
      {
        label: "Order Tracking",
        href: "#",
        disabled: true,
      },
    ],
  },
  {
    label: "Customers",
    href: "#",
    icon: Users,
    disabled: true,
  },
  {
    label: "Reports",
    href: "#",
    icon: FileText,
    disabled: true,
  },
];

// Menu pengaturan — tampil dulu, fungsinya menyusul.
export const adminSettingsNavigation: AdminNavItem[] = [
  {
    label: "Marketplace Sync",
    href: "#",
    icon: Store,
    disabled: true,
  },
  {
    label: "Payment Gateways",
    href: "#",
    icon: CreditCard,
    disabled: true,
  },
  {
    label: "Settings",
    href: "#",
    icon: Settings,
    disabled: true,
  },
  {
    label: "Help Center",
    href: "#",
    icon: HelpCircle,
    disabled: true,
  },
];
