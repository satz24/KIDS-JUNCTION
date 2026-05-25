import type { Product, Review, Testimonial } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "rainbow-knit-sweater",
    name: "Rainbow Knit Sweater",
    description: "Cozy organic cotton sweater with playful rainbow stripes.",
    longDescription:
      "Crafted from 100% organic cotton, this rainbow knit sweater keeps your little one warm and stylish. Features soft ribbed cuffs, a comfortable crew neck, and vibrant colors that won't fade after washing. Perfect for layering in cooler weather.",
    price: 34.99,
    originalPrice: 44.99,
    images: [
      "https://images.unsplash.com/photo-1519237105318-cf423ebca5a0?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop",
    ],
    category: "boys-wear",
    brand: "LittleJoy",
    ageRange: "2-6 years",
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    colors: ["Rainbow", "Blue", "Pink"],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 45,
    tags: ["organic", "winter", "bestseller"],
    featured: true,
    trending: true,
  },
  {
    id: "2",
    slug: "floral-dress-princess",
    name: "Floral Princess Dress",
    description: "Elegant floral dress with soft tulle layers.",
    longDescription:
      "Make every day special with this enchanting floral princess dress. Features delicate tulle overlay, comfortable cotton lining, and a hidden back zipper for easy dressing. Machine washable and designed to withstand active play.",
    price: 42.99,
    originalPrice: 54.99,
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e017ddd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1494679142940-9d423c791c12?w=800&h=800&fit=crop",
    ],
    category: "girls-wear",
    brand: "TinyBloom",
    ageRange: "3-8 years",
    sizes: ["3T", "4T", "5T", "6T", "7T", "8T"],
    colors: ["Pink Floral", "Lavender", "White"],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockCount: 32,
    tags: ["party", "formal", "bestseller"],
    featured: true,
    trending: true,
  },
  {
    id: "3",
    slug: "organic-baby-onesie-set",
    name: "Organic Baby Onesie Set",
    description: "Set of 3 soft organic cotton onesies for newborns.",
    longDescription:
      "Gentle on sensitive skin, these GOTS-certified organic cotton onesies feature snap closures for easy diaper changes. Includes three adorable prints in a gift-ready box. Hypoallergenic and free from harmful chemicals.",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-f63acfada403?w=800&h=800&fit=crop",
    ],
    category: "baby-collection",
    brand: "PureNest",
    ageRange: "0-12 months",
    sizes: ["NB", "0-3M", "3-6M", "6-12M"],
    colors: ["Pastel Mix"],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockCount: 78,
    tags: ["organic", "newborn", "gift-set"],
    featured: true,
    trending: true,
  },
  {
    id: "4",
    slug: "wooden-building-blocks",
    name: "Wooden Building Blocks Set",
    description: "100-piece natural wood blocks for creative building.",
    longDescription:
      "Develop fine motor skills and spatial awareness with this premium 100-piece wooden block set. Made from sustainably sourced beech wood with non-toxic water-based paint. Includes a storage bag and activity guide with 20 building ideas.",
    price: 39.99,
    originalPrice: 49.99,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da280a25?w=800&h=800&fit=crop",
    ],
    category: "educational-toys",
    brand: "BrainPlay",
    ageRange: "2-8 years",
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    stockCount: 56,
    tags: ["stem", "wooden", "educational"],
    featured: true,
    trending: true,
  },
  {
    id: "5",
    slug: "plush-bear-companion",
    name: "Plush Bear Companion",
    description: "Ultra-soft huggable teddy bear, 16 inches tall.",
    longDescription:
      "Meet Barnaby, the softest teddy bear your child will ever hug. Made with premium hypoallergenic polyester fill and velvety plush fabric. Safety-tested for all ages with embroidered eyes and nose. Machine washable.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1530325552511-855fa066f314?w=800&h=800&fit=crop",
    ],
    category: "soft-toys",
    brand: "CuddleCo",
    ageRange: "0+ years",
    colors: ["Brown", "Cream", "Gray"],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockCount: 92,
    tags: ["plush", "gift", "bestseller"],
    trending: true,
  },
  {
    id: "6",
    slug: "turbo-race-car-rc",
    name: "Turbo Race Car RC",
    description: "High-speed remote control car with LED lights.",
    longDescription:
      "Experience thrilling races with this turbo RC car featuring 2.4GHz remote control, LED headlights, and all-terrain tires. Reaches speeds up to 15 mph with a 30-minute battery life. Includes USB charging cable and spare parts.",
    price: 59.99,
    originalPrice: 74.99,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop",
    ],
    category: "remote-cars",
    brand: "SpeedKids",
    ageRange: "6+ years",
    colors: ["Red", "Blue", "Green"],
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    stockCount: 34,
    tags: ["rc", "outdoor", "action"],
    trending: true,
  },
  {
    id: "7",
    slug: "science-experiment-kit",
    name: "Junior Science Experiment Kit",
    description: "50+ safe experiments for budding scientists.",
    longDescription:
      "Spark curiosity with 50+ hands-on science experiments using safe household ingredients. Includes lab goggles, test tubes, measuring tools, and a detailed instruction book. Covers chemistry, physics, and biology concepts.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da280a25?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop",
    ],
    category: "learning-kits",
    brand: "BrainPlay",
    ageRange: "5-12 years",
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    stockCount: 41,
    tags: ["stem", "science", "gift"],
    featured: true,
  },
  {
    id: "8",
    slug: "kids-backpack-set",
    name: "Kids Backpack & Lunch Set",
    description: "Durable backpack with matching insulated lunch box.",
    longDescription:
      "Ready for school adventures with this ergonomic backpack featuring padded straps, multiple compartments, and water-resistant fabric. Includes a matching insulated lunch box and pencil case. Available in fun character designs.",
    price: 49.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop",
    ],
    category: "school-accessories",
    brand: "SchoolReady",
    ageRange: "4-10 years",
    colors: ["Blue Dino", "Pink Unicorn", "Green Space"],
    rating: 4.5,
    reviewCount: 94,
    inStock: true,
    stockCount: 67,
    tags: ["school", "back-to-school", "set"],
    trending: true,
  },
  {
    id: "9",
    slug: "denim-overall-set",
    name: "Denim Overall Set",
    description: "Classic denim overalls with striped tee combo.",
    longDescription:
      "Timeless style meets everyday comfort in this denim overall set. Adjustable straps, reinforced knees for durability, and a soft cotton striped tee included. Perfect for playdates and casual outings.",
    price: 38.99,
    images: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop",
    ],
    category: "boys-wear",
    brand: "LittleJoy",
    ageRange: "2-5 years",
    sizes: ["2T", "3T", "4T", "5T"],
    rating: 4.6,
    reviewCount: 45,
    inStock: true,
    stockCount: 28,
    tags: ["casual", "denim"],
  },
  {
    id: "10",
    slug: "unicorn-pajama-set",
    name: "Unicorn Pajama Set",
    description: "Magical unicorn print pajamas, soft fleece material.",
    longDescription:
      "Sweet dreams await in these cozy fleece pajamas featuring adorable unicorn prints. Tag-free labels, elastic waistband, and flame-retardant fabric for safety. Available in sizes for toddlers through big kids.",
    price: 26.99,
    originalPrice: 32.99,
    images: [
      "https://images.unsplash.com/photo-1494679142940-9d423c791c12?w=800&h=800&fit=crop",
    ],
    category: "girls-wear",
    brand: "TinyBloom",
    ageRange: "2-8 years",
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T", "8T"],
    rating: 4.8,
    reviewCount: 112,
    inStock: true,
    stockCount: 53,
    tags: ["sleepwear", "unicorn"],
  },
  {
    id: "11",
    slug: "musical-xylophone",
    name: "Rainbow Musical Xylophone",
    description: "Colorful xylophone with mallets for musical fun.",
    longDescription:
      "Introduce your child to music with this beautifully crafted rainbow xylophone. Each bar is tuned to produce clear, pleasant tones. Made from child-safe wood and metal with rounded edges.",
    price: 19.99,
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da280a25?w=800&h=800&fit=crop",
    ],
    category: "educational-toys",
    brand: "MelodyKids",
    ageRange: "1-5 years",
    rating: 4.5,
    reviewCount: 88,
    inStock: true,
    stockCount: 64,
    tags: ["music", "montessori"],
  },
  {
    id: "12",
    slug: "elephant-plush-large",
    name: "Giant Elephant Plush",
    description: "Extra-large 24-inch elephant plush toy.",
    longDescription:
      "This gentle giant elephant plush is perfect for snuggling, reading time, or room decor. Premium quality stitching ensures years of companionship. Weighted bottom keeps it sitting upright.",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1530325552511-855fa066f314?w=800&h=800&fit=crop",
    ],
    category: "soft-toys",
    brand: "CuddleCo",
    ageRange: "0+ years",
    rating: 4.9,
    reviewCount: 167,
    inStock: true,
    stockCount: 23,
    tags: ["plush", "large", "gift"],
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Absolutely love the quality! The organic cotton feels so soft on my baby's skin. Will definitely order again.",
    date: "2026-04-15",
  },
  {
    id: "2",
    author: "James K.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Fast shipping and the RC car is a hit with my 7-year-old. Built solid and the battery life is impressive.",
    date: "2026-04-10",
  },
  {
    id: "3",
    author: "Emily R.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    comment: "The princess dress is even more beautiful in person. My daughter wore it to her birthday and got so many compliments!",
    date: "2026-03-28",
  },
  {
    id: "4",
    author: "Michael T.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Great educational toys selection. The building blocks set has kept my twins entertained for hours.",
    date: "2026-03-20",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jennifer Walsh",
    role: "Mom of 2",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Kids Junction has become our go-to store for everything kids. The quality is outstanding and I love knowing everything is safety-tested.",
  },
  {
    id: "2",
    name: "David Chen",
    role: "Dad & Gift Buyer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Ordered a birthday gift for my niece — arrived beautifully packaged within 2 days. The plush bear is adorable and so soft!",
  },
  {
    id: "3",
    name: "Amanda Foster",
    role: "Teacher & Mom",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    comment: "The learning kits are fantastic for homeschooling. My kids are engaged and learning without even realizing it. Highly recommend!",
  },
  {
    id: "4",
    name: "Robert Kim",
    role: "First-time Dad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    comment: "As a new parent, I appreciate the detailed product descriptions and age recommendations. Makes shopping stress-free!",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.trending);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getAgeRanges(): string[] {
  return [...new Set(products.map((p) => p.ageRange))].sort();
}
