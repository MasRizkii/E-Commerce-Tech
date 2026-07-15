import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

type StoreLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}