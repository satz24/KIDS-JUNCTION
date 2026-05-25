import type { Metadata } from "next";
import { ProductShowcaseSection } from "@/components/home/product-showcase-section";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata: Metadata = {
  title: "Full Collection",
  description: "Browse the complete Kids Junction collection — kids wear, toys, baby essentials & more.",
};

export default function CollectionPage() {
  return (
    <div className="pt-8">
      <div className="container mx-auto px-4 mb-4">
        <ScrollReveal>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Full <span className="text-brand-pink">Collection</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Tap any product for details and WhatsApp inquiry
          </p>
        </ScrollReveal>
      </div>
      <ProductShowcaseSection showAll showViewAll={false} />
    </div>
  );
}
