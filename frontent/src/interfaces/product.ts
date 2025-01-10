export interface Gallery {
  id: number;
  image: string;
  caption: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  average_rating: number;
  gallery: Gallery[];
  price: number;
  category: ProductCategory;
  characteristics: ProductCharacteristic[];
  discounted_price: number;
  discount_percentage: number;
  stock: number;
  is_featured: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCharacteristic {
  id: number
  name: string;
  value: string;
  suffix: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
}

