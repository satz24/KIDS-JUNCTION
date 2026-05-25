import Link from "next/link";
import { Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social-icons";
import { storeInfo } from "@/lib/data/store";

export function Footer() {
  return (
    <footer className="relative bg-card border-t mt-auto overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-brand-pink/5 pointer-events-none" />
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="text-brand-pink italic text-sm">{storeInfo.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {storeInfo.about}
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-brand-green">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Collection", href: "/#collection" },
                { label: "About Us", href: "/#about" },
                { label: "Gallery", href: "/#gallery" },
                { label: "Contact", href: "/#contact" },
                { label: "Full Collection", href: "/collection" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-brand-pink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4 text-brand-pink">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                {storeInfo.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.landlineLink} className="hover:text-brand-green">
                  {storeInfo.landline}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.whatsappLink} className="hover:text-brand-green">
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green" />
                {storeInfo.timings.weekdays}
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href={storeInfo.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={storeInfo.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {storeInfo.name}. Order via WhatsApp — visit store to purchase.
        </div>
      </div>
    </footer>
  );
}
