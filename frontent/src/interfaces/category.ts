import { Product } from "./product";

export interface CategoryCharacteristic {
    id: number;
    name: string;
    data_type: string;
    suffix?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    characteristics: CategoryCharacteristic[];
    products: Product[];
    created_at: string;
    updated_at: string
}