export interface Gallery {
    id: number;
    image: string;
    caption: string;
}

export interface Product {
    id: number;
    name: string;
    average_rating: number;
    gallery: Gallery[];
    price: number;
    discounted_price: number;
    discount_percentage: number;
    stock: number,
    description: string;
    [key: string]: any;
}

export interface Characteristic {
    name: string;
    value: string;
}

export interface Category {
    name: string;
    slug: string;
}

export interface ProductDetails {
    id: number;
    name: string;
    slug: string;
    average_rating: number;
    description: string;
    price: number;
    discount_percentage: number;
    discounted_price: number;
    stock: number;
    category: Category;
    is_featured: boolean;
    gallery: Gallery[];
    characteristics: Characteristic[];
}