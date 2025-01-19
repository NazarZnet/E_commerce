export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
}

export interface UpdateUserInfoPayload {
    first_name: string;
    last_name: string;
    email: string;
}
