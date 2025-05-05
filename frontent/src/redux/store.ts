import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage
import filterReducer from "./slices/filterSlice";
import basketReducer from "./slices/basketSlice";
import authReducer from "./slices/authSlice"; // Import the auth slice

// Persist configuration for redux-persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "basket", "filters"], // Specify which slices to persist
};

// Combine reducers
const rootReducer = combineReducers({
    filters: filterReducer,
    basket: basketReducer,
    auth: authReducer, // Add the auth slice
});

// Wrap rootReducer with persistReducer  
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
    reducer: persistedReducer,
});

// Configure the persistor
export const persistor = persistStore(store);

// Infer types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;