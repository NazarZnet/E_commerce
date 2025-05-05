import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    category: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    characteristics?: Record<string, string | number | boolean | { min?: number; max?: number }>;
}

const initialState: FilterState = {
    category: null,
    minPrice: null,
    maxPrice: null,
    characteristics: {},
};

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<FilterState>) => {
            console.log("New filters:", action);
            Object.assign(state, action.payload);
        },
        resetFilters: () => initialState,
    },
});


export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;