import { PaginatedResponse } from "./pagination";

export interface ProductOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  unitPrice?: number;
  options: ProductOption[];
}

export interface ProductPrice {
  currency: string;
  amount: number;
}

export interface Product {
  id: number;
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
  id: number; // Product ID
  name: string;
  price: ProductPrice;
  imageUrl?: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export type CreateProductRequest = Omit<Product, 'id'>;

// Type for the specific product paginated response
export type ProductsResponse = PaginatedResponse<Product>;