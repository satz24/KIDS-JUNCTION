import { HeroSection } from "@/components/home/hero-section";
import { CollectionsSection } from "@/components/home/collections-section";
import { ProductShowcaseSection } from "@/components/home/product-showcase-section";
import { AboutSection } from "@/components/home/about-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ContactSection } from "@/components/home/contact-section";
import { storeInfo } from "@/lib/data/store";
import { Suspense } from "react";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeInfo.name,
    description: storeInfo.about,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
    telephone: storeInfo.landline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "133, G.S.T. Road",
      addressLocality: "Guduvanchery",
      postalCode: "603202",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "20:00",
      },
    ],
    sameAs: [storeInfo.facebook.url, storeInfo.instagram.url],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <CollectionsSection />
      <Suspense fallback={null}>
        <ProductShowcaseSection limit={8} />
      </Suspense>
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
