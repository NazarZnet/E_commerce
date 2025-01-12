import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import basketReducer from "./slices/basketSlice";

export const store = configureStore({
    reducer: {
        filters: filterReducer,
        basket: basketReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;