import axios from "axios";
import { Category } from "../interfaces/category";
import { Product, ProductComment } from "../interfaces/product";
import { UpdateUserInfoPayload } from "../interfaces/user";

const API_BASE_URL = '/api';

// Fetch Featured Products
export const getFeaturedProducts = async (language: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products?is_featured=true&lang=${language}`, {
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
export const getCategories = async (language: string): Promise<Category[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories?lang=${language}`, {
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
    fallbackThreshold: number = 5,
    language: string
): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products?lang=${language}`, {
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
export const getProductDetails = async (slug: string, language: string): Promise<Product | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${slug}?lang=${language}`, {
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
        return product as Product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
};

export const getSimilarProducts = async (slug: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${slug}/similar`, {
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



// Generate a temporary password
export const generateTempPassword = async (email: string): Promise<void> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/generate-temp-password/`, {
            email,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to generate temporary password.");
    }
};

// Verify temporary password and login
export const verifyTempPassword = async (email: string, tempPassword: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify-temp-password/`, {
            email,
            temp_password: tempPassword,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Verification failed.");
    }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string | null): Promise<any> => {
    try {


        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });

        return response.data;
    } catch (error: any) {
        throw {
            response: error.response,
            mesage: error.response?.data?.message || "Failed to refresh access token."
        };
    }
};

// Fetch profile data
export const fetchProfile = async (accessToken: string | null, language: string): Promise<any> => {
    try {

        const response = await axios.get(`${API_BASE_URL}/profile/?lang=${language}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw { response: error.response, message: "Unauthorized" };
        }

        throw {
            response: error.response || null,
            message: error.response?.data?.message || "Failed to fetch profile data.",
        };
    }
};


// Fetch profile data
export const deleteComment = async (accessToken: string | null, commentId: number): Promise<number> => {
    try {

        const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.status;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw { response: error.response, message: "Unauthorized" };
        }

        throw {
            response: error.response || null,
            message: error.response?.data?.message || "Failed to fetch profile data.",
        };
    }
};

export const updateUserInfo = async (
    payload: UpdateUserInfoPayload,
    accessToken: string | null
): Promise<any> => {
    try {

        const response = await axios.put(
            `${API_BASE_URL}/users/update/`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw { response: error.response, message: "Unauthorized" };
        }

        throw {
            response: error.response || null,
            message: error.response?.data?.message || "Failed to update user info.",
        };
    }
};

export interface SaveCommentData {
    product: number; // Product ID
    comment?: string; // Optional comment text
    rating?: number;  // Optional rating (1 to 5 stars)
}

export const saveComment = async (data: SaveCommentData, accessToken: string | null): Promise<ProductComment> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/comments/`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            // Handle token expiration, refreshing token, or redirecting to login
            throw {
                response: error.response,
                message: "Authentication required. Please log in."
            };
        }
        throw {
            response: error.response,
            message: error.response?.data?.detail || "Failed to save the comment."
        };


    }
};

export const subscribeUser = async (email: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/subscribe/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.email?.[0] || "Failed to subscribe");
        }

        const data = await response.json();
        return data.message; // "Successfully subscribed!"
    } catch (error: any) {
        throw new Error(error.message);
    }
};