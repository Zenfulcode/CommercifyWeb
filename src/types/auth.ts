export interface Address {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    shippingAddress?: Address;
    billingAddress?: Address;
    roles: string[];
}

export interface RegisterRequest {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    isGuest?: boolean;
    shippingAddress?: Address;
    billingAddress?: Address;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}