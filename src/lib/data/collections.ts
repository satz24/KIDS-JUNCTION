export interface StoreCollection {
  id: string;
  name: string;
  image: string;
  productCategories: string[];
}

export const storeCollections: StoreCollection[] = [
  {
    id: "just-born-needs",
    name: "Just Born Needs",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop",
    productCategories: ["baby-collection"],
  },
  {
    id: "kids-wear",
    name: "Kids Wear",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
    productCategories: ["boys-wear", "girls-wear"],
  },
  {
    id: "mother-care",
    name: "Mother Care",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92a47ddd?w=400&h=400&fit=crop",
    productCategories: ["baby-collection"],
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    productCategories: ["educational-toys", "soft-toys", "learning-kits"],
  },
  {
    id: "battery-cars",
    name: "Battery Cars",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop",
    productCategories: ["remote-cars"],
  },
  {
    id: "baby-cycles",
    name: "Baby Cycles",
    image: "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=400&h=400&fit=crop",
    productCategories: ["school-accessories"],
  },
];

export function getCollectionById(id: string) {
  return storeCollections.find((collection) => collection.id === id);
}

export function getProductsForCollection(collectionId: string) {
  const collection = getCollectionById(collectionId);
  if (!collection) return null;
  return collection.productCategories;
}
