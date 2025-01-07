import { Category } from "../interfaces/category";
import { Product, ProductDetails } from "../interfaces/product";

const ApiBase = '/api';

// Fetch Featured Products
export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${ApiBase}/products?is_featured=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }

        const jsondata = await response.json();
        return jsondata.results as Product[];
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        return [];
    }
};

// Fetch Categories
export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${ApiBase}/categories/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }

        const jsondata = await response.json();
        return jsondata.results as Category[];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
};

// Fetch Popular Products
export const getPopularProducts = async (
    minRating: number = 4.0,
    fallbackThreshold: number = 5
): Promise<Product[]> => {
    try {
        const response = await fetch(`${ApiBase}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error fetching popular products! Status: ${response.status}`);
            return [];
        }

        const json = await response.json();
        const products = json.results as Product[];

        // Filter popular products based on rating
        const popularProducts = products.filter(
            (product) => product.average_rating && product.average_rating >= minRating
        );

        // Fallback to all products if insufficient popular products
        if (popularProducts.length < fallbackThreshold) {
            console.warn(
                `Insufficient popular products (${popularProducts.length}). Returning all products instead.`
            );
            return products;
        }

        return popularProducts;
    } catch (error) {
        console.error('Error fetching popular products:', error);
        return [];
    }
};
// Fetch Product Details
export const getProductDetails = async (slug: string): Promise<ProductDetails | null> => {
    try {
        const response = await fetch(`${ApiBase}/products/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error fetching product details! Status: ${response.status}`);
            return null;
        }

        const product = await response.json();
        return product as ProductDetails;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
};

export const getSimilarProducts = async (slug: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${ApiBase}/products/${slug}/similar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }

        const jsondata = await response.json();
        return jsondata.results as Product[];
    } catch (error) {
        console.error('Failed to fetch similar products:', error);
        return [];
    }
};
