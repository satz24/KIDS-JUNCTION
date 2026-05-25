# Kids Junction — Informative Showcase Website

A modern, premium **informative** website for Kids Junction — a kids clothing & toys shop in Guduvanchery. This is **not** an e-commerce site. Products are showcased with names and prices; customers visit the store or contact via WhatsApp/Instagram.

## Features

- **Hero** — Animated intro with Explore Collection, Visit Store, Contact Us CTAs
- **Product Showcase** — Category filters, hover cards, modal with WhatsApp inquiry
- **About** — Shop story, trust highlights, animated stats
- **Gallery** — Instagram-style masonry layout
- **Testimonials** — Parent reviews carousel
- **Contact** — Google Maps, store timings, phone, WhatsApp, social links
- **Floating WhatsApp button** — Always accessible on mobile & desktop
- **Dark/light mode**, scroll animations, mobile bottom nav

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Radix UI

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Store Details

Configured in `src/lib/data/store.ts`:

- **Address:** # 133, G.S.T. Road, Guduvanchery - 603 202
- **Phone:** 044-4775 8868
- **WhatsApp:** 9789 883 773
- **Instagram:** @kj_kutties
- **Facebook:** KJ kutties

## Pages

| Route | Purpose |
|---|---|
| `/` | Full informative homepage |
| `/collection` | Complete product catalog |
| `/shop`, `/cart`, `/checkout` | Redirect to collection/contact |

## License

Private — All rights reserved.
