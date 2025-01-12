import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../interfaces/product";

interface BasketState {
    items: {
        product: Product;
        quantity: number;
    }[];
}

const initialState: BasketState = {
    items: [],
};

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        addItem: (
            state,
            action: PayloadAction<{ product: Product; quantity?: number }>
        ) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                // Increase the quantity of the existing product
                existingItem.quantity += quantity;
            } else {
                // Add the new product to the basket
                state.items.push({ product, quantity });
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.product.id !== productId);
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((item) => item.product.id === productId);

            if (item) {
                if (quantity > 0) {
                    item.quantity = quantity;
                } else {
                    // Remove the item if quantity is zero
                    state.items = state.items.filter(
                        (item) => item.product.id !== productId
                    );
                }
            }
        },
        clearBasket: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearBasket } =
    basketSlice.actions;

export default basketSlice.reducer;