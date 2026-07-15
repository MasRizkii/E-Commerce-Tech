import { HeroSlider } from "@/features/home/components/hero-slider";
import { ProductSection } from "@/features/home/components/product-section";
import { PromoBanner } from "@/features/home/components/promo-banner";
import { PromoCards } from "@/features/home/components/promo-cards";
import { QuickMenu } from "@/features/home/components/quick-menu";
import {
  getFeaturedProducts,
  getNewArrivalProducts,
} from "@/features/products/queries";
import { Container } from "@/components/ui/container";

export default async function HomePage() {
  const [featuredProducts, newArrivalProducts] =
  await Promise.all([
    getFeaturedProducts(4),
    getNewArrivalProducts(4),
  ]);
  return (
    <div className="bg-futuristic py-5 sm:py-8">
      <Container className="relative z-10 space-y-7 sm:space-y-9">
        <HeroSlider />

        <QuickMenu />

        <PromoBanner />

        <ProductSection
          title="Featured Products"
          products={featuredProducts}
        />

        <ProductSection
          title="Just Arrived"
          products={newArrivalProducts}
          viewAllHref="/shop?sort=newest"
        />

        <PromoCards />
      </Container>
    </div>
  );
}
