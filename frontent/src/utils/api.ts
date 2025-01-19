import axios from "axios";
import { Category } from "../interfaces/category";
import { Product } from "../interfaces/product";
import { UpdateUserInfoPayload, User } from "../interfaces/user";

const API_BASE_URL = '/api';

// Fetch Featured Products
export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products?is_featured=true`, {
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
        const response = await fetch(`${API_BASE_URL}/categories/`, {
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
        const response = await fetch(`${API_BASE_URL}/products`, {
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
export const getProductDetails = async (slug: string): Promise<Product | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
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
// Save tokens to localStorage
const saveTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
};

// Remove tokens from localStorage
export const clearTokens = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
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

        const { access, refresh } = response.data;

        // Save tokens to localStorage
        saveTokens(access, refresh);

        return response.data.user; // Return user data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Verification failed.");
    }
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string> => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            throw new Error("No refresh token found.");
        }

        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });

        const { access } = response.data;

        // Save new access token to localStorage
        localStorage.setItem("access_token", access);

        return access;
    } catch (error: any) {
        clearTokens();
        throw new Error(error.response?.data?.message || "Failed to refresh access token.");
    }
};

// Fetch profile data
export const fetchProfile = async (): Promise<any> => {
    try {
        let accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            // If no access token, try to refresh it
            accessToken = await refreshAccessToken();
        }

        const response = await axios.get(`${API_BASE_URL}/profile/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data; // Return profile data
    } catch (error: any) {
        if (error.response?.status === 401) {
            // If refresh token expired or invalid
            clearTokens();
            throw { response: { status: 401 }, message: "Unauthorized" };
        }

        throw {
            response: error.response || null,
            message: error.response?.data?.message || "Failed to fetch profile data.",
        };
    }
};

export const updateUserInfo = async (
    payload: UpdateUserInfoPayload
): Promise<User> => {
    try {
        let accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
            // If no access token, try to refresh it
            accessToken = await refreshAccessToken();
        }
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

        return response.data; // Assuming the updated user info is returned in the response
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error("Unauthorized: Please login again.");
        }
        throw new Error(error.response?.data?.message || "Failed to update user info.");
    }
};