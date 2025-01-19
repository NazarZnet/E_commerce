import { Product } from "./product";

export interface OrderItem {
    product: Product
    quantity: number;
}

export interface Order {
    id: number;
    status: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    phone: string;
    order_notes: string | null;
    total_price: number;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}