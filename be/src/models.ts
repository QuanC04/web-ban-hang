import type { Address, Category, Product, User } from '@prisma/client';
import type { Request } from 'express';

export type { Address, Category, Product, User };

export interface AuthUser {
    userId: string;
    role?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export type SafeUser = Omit<User, 'password' | 'access_token' | 'refresh_token'>;

export interface AuthResult extends AuthTokens {
    user: SafeUser;
}

export interface UpdateProfilePayload {
    full_name?: string;
    phone_number?: string;
    avatar_url?: string;
}

export interface AddressPayload {
    name: string;
    phone_number: string;
    province: string;
    district: string;
    street: string;
    isdefault: boolean;
}

export interface ProductPayload {
    id?: string;
    name: string;
    description?: string;
    category_id: string;
    image_url?: string;
    image_key?: string;
    base_price: number;
    stock_quantity: number;
}

export interface UploadResult {
    url: string;
    key: string;
    mime: string;
    size: number;
}

export interface ApiResponse<T = null> {
    success: boolean;
    message: string;
    data: T | null;
}

export interface ApiErrorPayload {
    code: string;
    details?: unknown;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    error: ApiErrorPayload;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AppError {
    statusCode?: number;
    message?: string;
    code?: string;
}

export interface CartItemPayload {
    productId: string;
    quantity: number;
}
