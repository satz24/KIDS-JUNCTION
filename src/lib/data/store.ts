export const storeInfo = {
  name: "Kids Junction",
  tagline: "... No:1 baby shop ...",
  address: "# 133, G.S.T. Road, Guduvanchery - 603 202",
  mobile: "97898 83773",
  mobileLink: "tel:+919789883773",
  landline: "044-4775 8868",
  landlineLink: "tel:+914447758868",
  whatsapp: "9789883773",
  whatsappDisplay: "9789 883 773",
  whatsappLink: "https://wa.me/919789883773",
  facebook: {
    handle: "KJ kutties",
    url: "https://www.facebook.com/kjkutties",
  },
  instagram: {
    handle: "kj_kutties",
    url: "https://www.instagram.com/kj_kutties",
  },
  timings: {
    weekdays: "9:30 AM – 9:30 PM",
    sunday: "9:30 AM – 9:30 PM",
    note: "Open all days",
  },
  about:
    "⭐ Kids Junction – Baby & Toy Store | Guduvanchery, Chennai 💓 13+ Years of Trust | 23,000+ Satisfied Customers Kids Junction is an esteemed baby shop in Guduvanchery, Chennai, proudly serving families since 2013 👶🧸. With over 13 years of experience, we have had the privilege of catering to more than 22 000 happy and satisfied customers 😊✨. Our dedication to providing top-quality baby essentials comes from a genuine passion for nurturing little ones 💖. Every product we offer is carefully chosen to support the comfort, safety, and happiness of babies and growing families 🍼🎁🚗. With the love and trust of our customers, we continue to grow stronger day by day 🌟. At Kids Junction, we serve our beloved customers with a loving ❤️ heart",
  mapEmbed:
    "https://maps.google.com/maps?q=133+GST+Road+Guduvanchery+603202&output=embed",
  mapQuery: "133 GST Road Guduvanchery 603202",
  googleReviews: {
    url: "https://www.google.com/search?q=Kids+junction+Reviews&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOa0dZ08bQ_HWYzMAue6lbt4rJ0Wjaaw6sBnyPG7KOYzhTXDyhBT_NCIQ7e0IlMtDGWgkdEE9uBFCcG8Pbn-2Fjq_t3v8",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kids+Junction+133+GST+Road+Guduvanchery+603202",
    searchQuery: "Kids Junction 133 GST Road Guduvanchery 603202",
  },
  products: [
    "Just Born Needs",
    "Kids Wear",
    "Mother Care",
    "Toys & Games",
    "Battery Cars",
    "Baby Cycles",
  ],
} as const;

export function getWhatsAppInquiryLink(productName: string, price: string) {
  const message = encodeURIComponent(
    `Hi Kids Junction! I'm interested in "${productName}" (${price}). Is it available?`
  );
  return `${storeInfo.whatsappLink}?text=${message}`;
}
