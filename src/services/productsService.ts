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

    async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
        return this.fetchWithPagination<Product>(
            '/products/active',
            this.EMBEDDED_KEY,
            params,
            false
        );
    }

    async getProductById(id: string): Promise<Product> {
        return this.get<Product>(`/products/${id}`, false);
    }

    async createProduct(product: CreateProductRequest): Promise<Product> {
        return this.post<Product>('/products', product, true);
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        return this.put<Product>(`/products/${id}`, product, true);
    }

    async deleteProduct(id: string): Promise<void> {
        return this.delete(`/products/${id}`, true);
    }
}

export const productApi = ProductService.getInstance();