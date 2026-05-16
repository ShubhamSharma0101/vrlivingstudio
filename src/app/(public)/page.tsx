import { HeroSection } from "@/features/home/components/hero-section";
import { FeaturedCategories } from "@/features/home/components/featured-categories";
import { FeaturedProducts } from "@/features/home/components/featured-products";
import { TrustSection } from "@/features/home/components/trust-section";
import { TestimonialSection } from "@/features/home/components/testimonial-section";
import { NewsletterSection } from "@/features/home/components/newsletter-section";
import { PremiumFooter } from "@/features/home/components/premium-footer";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <FeaturedCategories />

      <FeaturedProducts />

      <TrustSection />

      <TestimonialSection />

      <NewsletterSection />

      <PremiumFooter />
    </>
  );
}