import { PaginatedResponse } from "./pagination";

export interface ProductOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id?: string;
  sku: string;
  unitPrice?: number;
  imageUrl?: string;
  options: ProductOption[];
}

export interface ProductPrice {
  currency: string;
  amount: number;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: ProductPrice;
  active: boolean;
  imageUrl?: string;
  variants: ProductVariant[];
  stock: number;
  category?: string;
}


export interface CartItem {
  cartItemId: string; // Unique identifier for cart item
  id: string; // Product ID
  name: string;
  price: ProductPrice;
  imageUrl?: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type CreateProductRequest = Omit<Product, 'id'>;

// Type for the specific product paginated response
export type ProductsResponse = PaginatedResponse<Product>;