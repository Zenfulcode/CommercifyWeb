import { PaginatedResponse, PaginationParams } from '@/types/pagination';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const getAuthHeader = () => {
    if (typeof window === 'undefined') return undefined;

    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
};
interface RequestOptions {
    requiresAuth?: boolean;
    includeContentType?: boolean;
}

export abstract class BaseApiService {
    protected constructor(
        protected baseUrl: string
    ) { }

    protected getHeaders(options: RequestOptions = {}): HeadersInit {
        const { requiresAuth = false, includeContentType = true } = options;

        const headers: HeadersInit = {
            ...(includeContentType && { 'Content-Type': 'application/json' }),
            ...(requiresAuth && getAuthHeader())
        };
        return headers;
    }

    protected async fetchWithPagination<T>(
        endpoint: string,
        embeddedKey: string,
        params: PaginationParams = {},
        requiresAuth = false
    ): Promise<PaginatedResponse<T>> {
        try {
            const queryParams = new URLSearchParams({
                page: (params.page ?? 0).toString(),
                size: (params.size ?? 10).toString(),
                ...(params.sort ? { sort: params.sort } : {})
            });

            const response = await fetch(
                `${this.baseUrl}${endpoint}?${queryParams.toString()}`,
                {
                    headers: this.getHeaders({ requiresAuth, includeContentType: false })
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new ApiError(401, 'Authentication required');
            }

            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    `API request failed: ${response.statusText}`
                );
            }

            const data = await response.json();

            if (!data._embedded || !data._embedded[embeddedKey]) {
                throw new ApiError(
                    500,
                    `Invalid response structure: missing _embedded.${embeddedKey}`
                );
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch data');
        }
    }

    protected async post<T>(
        endpoint: string,
        data: unknown,
        requiresAuth = false
    ): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders({ requiresAuth }),
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new ApiError(401, 'Authentication required');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new ApiError(
                    response.status,
                    errorData?.message || `Request failed: ${response.statusText}`
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Request failed');
        }
    }

    protected async get<T>(
        endpoint: string,
        requiresAuth = false
    ): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: this.getHeaders({ requiresAuth, includeContentType: false })
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new ApiError(401, 'Authentication required');
            }

            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    `API request failed: ${response.statusText}`
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch resource');
        }
    }

    protected async put<T>(
        endpoint: string,
        data: unknown,
        requiresAuth = false
    ): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders({ requiresAuth }),
                body: JSON.stringify(data),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new ApiError(401, 'Authentication required');
            }

            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    `API request failed: ${response.statusText}`
                );
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to update resource');
        }
    }

    protected async delete(
        endpoint: string,
        requiresAuth = false
    ): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders({ requiresAuth, includeContentType: false }),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new ApiError(401, 'Authentication required');
            }

            if (!response.ok) {
                throw new ApiError(
                    response.status,
                    `API request failed: ${response.statusText}`
                );
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to delete resource');
        }
    }
}