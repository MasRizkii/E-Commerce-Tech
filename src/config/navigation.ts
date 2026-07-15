export type NavigationItem = {
  label: string;
  href: string;
};

export const storeNavigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Contact",
    href: "/contact",
  },
] satisfies NavigationItem[];