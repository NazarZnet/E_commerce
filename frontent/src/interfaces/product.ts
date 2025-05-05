import { User } from "./user";

export interface Gallery {
  id: number;
  image: string;
  caption: string;
}


export interface ProductComment {
  id: number;
  product: number; // Reference to the product ID
  user: User; // User details
  rating: number; // Star rating (1-5)
  comment: string; // Text of the comment
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  name: string;
  slug: string;
  long_term_guarantee: boolean;
}

export interface ProductCharacteristic {
  id: number;
  name: string;
  value: string;
  suffix?: string;
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
  comments: ProductComment[]; // List of comments for the product
}