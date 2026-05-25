export const storeInfo = {
  name: "Kids Junction",
  tagline: "... No:1 baby shop ...",
  address: "# 133, G.S.T. Road, Guduvanchery - 603 202",
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
    weekdays: "9:30 AM – 8:30 PM",
    sunday: "10:00 AM – 8:00 PM",
    note: "Open all days",
  },
  about:
    "Kids Junction has been Guduvanchery's trusted destination for quality kids clothing, toys, and baby essentials. We handpick every product for safety, comfort, and style — at prices parents love.",
  mapEmbed:
    "https://maps.google.com/maps?q=133+GST+Road+Guduvanchery+603202&output=embed",
  mapQuery: "133 GST Road Guduvanchery 603202",
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
