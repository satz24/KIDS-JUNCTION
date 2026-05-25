import type { CategoryInfo } from "@/types";

export const categories: CategoryInfo[] = [
  {
    id: "boys-wear",
    name: "Boys Wear",
    description: "Stylish & comfy outfits for little gentlemen",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=700&fit=crop",
    gradient: "from-sky-400 to-brand-green",
    productCount: 48,
  },
  {
    id: "girls-wear",
    name: "Girls Wear",
    description: "Adorable fashion for every princess",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e017ddd1?w=600&h=700&fit=crop",
    gradient: "from-brand-pink to-lavender",
    productCount: 52,
  },
  {
    id: "baby-collection",
    name: "Baby Collection",
    description: "Soft essentials for your little one",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=700&fit=crop",
    gradient: "from-yellow to-brand-pink-light",
    productCount: 36,
  },
  {
    id: "educational-toys",
    name: "Educational Toys",
    description: "Learn while having fun",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=700&fit=crop",
    gradient: "from-lavender to-brand-green-light",
    productCount: 64,
  },
  {
    id: "soft-toys",
    name: "Soft Toys",
    description: "Cuddly companions for every age",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop",
    gradient: "from-brand-pink-light to-brand-pink",
    productCount: 41,
  },
  {
    id: "remote-cars",
    name: "Remote Cars",
    description: "Thrilling battery-powered rides",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=700&fit=crop",
    gradient: "from-sky-400 to-brand-green-dark",
    productCount: 28,
  },
  {
    id: "school-accessories",
    name: "School Accessories",
    description: "Back-to-school essentials",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=700&fit=crop",
    gradient: "from-mint to-brand-green",
    productCount: 45,
  },
];

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function getCategoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? id;
}
