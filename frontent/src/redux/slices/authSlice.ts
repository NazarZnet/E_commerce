import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/user";

interface AuthState {
    access_token: string | null;
    refresh_token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    access_token: null,
    refresh_token: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (
            state,
            action: PayloadAction<{
                access_token: string;
                refresh_token: string;
                user: User;
            }>
        ) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.user = action.payload.user;
        },
        updateTokens: (
            state,
            action: PayloadAction<{
                access_token: string;
                refresh_token: string;
            }>
        ) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
        },
        clearAuthData: (state) => {
            state.access_token = null;
            state.refresh_token = null;
            state.user = null;
        },
    },
});

export const { setAuthData, clearAuthData, updateTokens } = authSlice.actions;
export default authSlice.reducer;