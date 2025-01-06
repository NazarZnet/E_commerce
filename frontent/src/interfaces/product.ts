export interface Gallery {
    id: number;
    image: string;
}

export interface Product {
    id: number;
    name: string;
    average_rating: number;
    gallery: Gallery[];
    price: number;
    discounted_price: number;
    discount_percentage: number;
    description: string;
    [key: string]: any;
}
