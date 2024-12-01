import { Product, CreateProductRequest, ProductsResponse } from '@/types/product';
import { PaginationParams } from '@/types/pagination';
import { BaseApiService } from '@/types/apiBase';

class ProductService extends BaseApiService {
    private static instance: ProductService;
    private readonly EMBEDDED_KEY = 'productViewModels';

    private constructor() {
        super('http://localhost:6091/api/v1');
    }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    // Public endpoint - no auth required
    async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
        return this.fetchWithPagination<Product>(
            '/products/active',
            this.EMBEDDED_KEY,
            params,
            false // doesn't require auth
        );
    }

    // Public endpoint - no auth required
    async getProductById(id: number): Promise<Product> {
        return this.get<Product>(`/products/${id}`, false);
    }

    // Protected endpoint - requires auth
    async createProduct(product: CreateProductRequest): Promise<Product> {
        return this.post<Product>('/products', product, true);
    }

    // Protected endpoint - requires auth
    async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
        return this.put<Product>(`/products/${id}`, product, true);
    }

    // Protected endpoint - requires auth
    async deleteProduct(id: number): Promise<void> {
        return this.delete(`/products/${id}`, true);
    }
}

export const productApi = ProductService.getInstance();