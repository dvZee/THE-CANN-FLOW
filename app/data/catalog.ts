export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string; // 'Hybrid' | 'Indica' | 'Sativa' | 'Pre-rolls' | 'Vapes' | 'Topicals' | 'Edibles' | 'Concentrates'
  price: number;
  originalPrice?: number;
  thc: string;
  rating: number;
  reviewsCount: number;
  image: string;
  isFeatured: boolean;
  weight: string;
  weights?: string[]; // Multiple weights available
  variants?: string[]; // Custom options/variants/flavors
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "flower-hybrid-1",
    name: "Pineapple Upside Down K",
    brand: "Modern Flower",
    description: "Pineapple Upside Down K is a ground flower Hybrid strain known for its sweet, tropical aroma. Delivers a balanced hybrid experience perfect for daytime relaxation.",
    category: "Hybrid",
    price: 30.00,
    originalPrice: 40.00,
    thc: "31.03%",
    rating: 4.6,
    reviewsCount: 25,
    image: "/uploads/flower-hybrid-1.png",
    isFeatured: true,
    weight: "7g",
    weights: ["3.5g", "7g", "14g", "28g"]
  },
  {
    id: "flower-indica-1",
    name: "Shadowberry",
    brand: "Modern Flower",
    description: "Shadowberry is an Indica strain with rich berry aromas and dark forest tones. Highly potent, it provides a deep, calming body sensation, ideal for evening use.",
    category: "Indica",
    price: 37.50,
    originalPrice: 75.00,
    thc: "30.82%",
    rating: 4.8,
    reviewsCount: 32,
    image: "/uploads/flower-indica-1.png",
    isFeatured: true,
    weight: "7g",
    weights: ["3.5g", "7g", "14g", "28g"]
  },
  {
    id: "flower-sativa-1",
    name: "Blue Beach Haze",
    brand: "Modern Flower",
    description: "Blue Beach Haze is a ground Sativa flower with a refreshing tropical profile. Uplifting and energizing, perfect for creativity and focus.",
    category: "Sativa",
    price: 30.00,
    thc: "30.89%",
    rating: 4.5,
    reviewsCount: 13,
    image: "/uploads/flower-sativa-1.png",
    isFeatured: true,
    weight: "7g",
    weights: ["3.5g", "7g", "14g", "28g"]
  },
  {
    id: "preroll-indica-1",
    name: "Grape Ape Pre-Rolls",
    brand: "Flow Farms",
    description: "A pack of 3 pre-rolled joints packed with premium Grape Ape Indica. Experience sweet grape flavors with quick-acting body-calming effects.",
    category: "Pre-rolls",
    price: 18.00,
    originalPrice: 22.00,
    thc: "24.00%",
    rating: 4.2,
    reviewsCount: 10,
    image: "/uploads/preroll-indica-1.png",
    isFeatured: true,
    weight: "3 x 0.5g",
    weights: ["3 x 0.5g", "5 x 0.5g"]
  },
  {
    id: "preroll-sativa-1",
    name: "Pineapple Express Pre-Rolls",
    brand: "Flow Farms",
    description: "Classic Sativa strain packed into convenient 5-pack pre-rolls. Offers clean cerebral elevation and an earthy, pineapple finish.",
    category: "Pre-rolls",
    price: 25.00,
    thc: "26.00%",
    rating: 4.4,
    reviewsCount: 8,
    image: "/uploads/preroll-sativa-1.png",
    isFeatured: false,
    weight: "5 x 0.5g",
    weights: ["5 x 0.5g"]
  },
  {
    id: "vape-sativa-1",
    name: "Super Lemon Haze Vape",
    brand: "Flow Vapes",
    description: "Premium distillate cartridge flavored with natural terpenes of Super Lemon Haze Sativa. Uplifting citrus notes, 510-threaded.",
    category: "Vapes",
    price: 45.00,
    originalPrice: 55.00,
    thc: "82.00%",
    rating: 4.7,
    reviewsCount: 42,
    image: "/uploads/vape-sativa-1.png",
    isFeatured: true,
    weight: "1g",
    weights: ["0.5g", "1g"]
  },
  {
    id: "vape-indica-1",
    name: "Granddaddy Purple Vape",
    brand: "Flow Vapes",
    description: "Rich grape distillate vape cartridge featuring the heavy indica vibes of GDP. Smooth draws, perfect for relaxing after a long day.",
    category: "Vapes",
    price: 45.00,
    thc: "80.00%",
    rating: 4.5,
    reviewsCount: 30,
    image: "/uploads/vape-indica-1.png",
    isFeatured: false,
    weight: "1g",
    weights: ["0.5g", "1g"]
  },
  {
    id: "topical-cbd-1",
    name: "1:3 Rescue Balm",
    brand: "Dr. Solomon's",
    description: "Specifically formulated topical balm containing 30mg CBD and 90mg THC. Delivers precise soothing effects directly to skin and muscles.",
    category: "Topicals",
    price: 16.25,
    originalPrice: 25.00,
    thc: "30mg CBD / 90mg THC",
    rating: 4.6,
    reviewsCount: 320,
    image: "/uploads/topical-cbd-1.png",
    isFeatured: false,
    weight: ".62oz",
    weights: [".62oz"]
  },
  {
    id: "topical-cbd-2",
    name: "Rescue Lotion",
    brand: "Dr. Solomon's",
    description: "Lightweight, quick-absorbing body lotion containing 200mg cannabinoids per bottle. Offers everyday comfort and a pleasant natural aroma.",
    category: "Topicals",
    price: 22.75,
    originalPrice: 35.00,
    thc: "200mg Cannabinoids",
    rating: 4.6,
    reviewsCount: 523,
    image: "/uploads/topical-cbd-2.png",
    isFeatured: false,
    weight: "1.8oz",
    weights: ["1.8oz"]
  },
  {
    id: "edible-gummies-1",
    name: "Peach THC Jelly Bites",
    brand: "Wana",
    description: "Delicious peach-flavored organic jelly bites infused with premium THC distillate. Sweet, juicy, and precise dosing for an uplifting edible experience.",
    category: "Edibles",
    price: 15.00,
    originalPrice: 20.00,
    thc: "10mg THC per pack",
    rating: 4.8,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400&q=80",
    isFeatured: true,
    weight: "5 x 2mg",
    weights: ["5 x 2mg"]
  },
  {
    id: "edible-chocolate-1",
    name: "Classic Milk Chocolate Bar",
    brand: "Bhang",
    description: "Artisanal milk chocolate bar divided into 4 pieces. Rich, creamy chocolate infused with lab-tested hybrid THC extract for a smooth body flow.",
    category: "Edibles",
    price: 12.00,
    thc: "10mg THC total",
    rating: 4.7,
    reviewsCount: 54,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
    isFeatured: false,
    weight: "40g",
    weights: ["40g"]
  },
  {
    id: "concentrate-shatter-1",
    name: "Pineapple Express Shatter",
    brand: "Flow Extracts",
    description: "Premium Sativa shatter offering a sweet tropical terpene profile. Yields rapid-acting cerebral focus and daytime energy.",
    category: "Concentrates",
    price: 40.00,
    originalPrice: 50.00,
    thc: "78.50%",
    rating: 4.8,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    isFeatured: true,
    weight: "1g",
    weights: ["1g", "2g"]
  },
  {
    id: "concentrate-resin-1",
    name: "Live Resin Sugar Badder",
    brand: "High Flyer",
    description: "A rich, golden Live Resin Sugar Badder made from freshly harvested frozen flowers. Offers full-spectrum terpenes and heavy body relaxation.",
    category: "Concentrates",
    price: 45.00,
    thc: "84.20%",
    rating: 4.9,
    reviewsCount: 27,
    image: "https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?w=400&q=80",
    isFeatured: false,
    weight: "1g",
    weights: ["1g"]
  }
];

export const getWeightFactor = (weight: string, category?: string): number => {
  if (category) {
    const catLower = category.toLowerCase();
    
    // Flower categories scale: Hybrid, Indica, Sativa
    if (catLower === "hybrid" || catLower === "indica" || catLower === "sativa") {
      switch (weight) {
        case "3.5g": return 0.55;
        case "7g": return 1.0;
        case "14g": return 1.8;
        case "28g": return 3.2;
        default: return 1.0;
      }
    }
    
    // Vape categories scale: Vapes
    if (catLower === "vapes") {
      switch (weight) {
        case "0.5g": return 0.6;
        case "1g": return 1.0;
        default: return 1.0;
      }
    }
    
    // Non-scaling categories (Concentrates, Edibles, Topicals, Pre-rolls)
    return 1.0;
  }

  // Fallback to old behavior if category is not provided
  switch (weight) {
    case "3.5g": return 0.55;
    case "7g": return 1.0;
    case "14g": return 1.8;
    case "28g": return 3.2;
    case "0.5g": return 0.6;
    case "1g": return 1.0;
    default: return 1.0;
  }
};

