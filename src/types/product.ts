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

export interface PriceData {
  currency: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: PriceData;
  active: boolean;
  imageUrl?: string;
  variants: ProductVariant[];
  stock: number;
  category?: string;
  actions?: React.ReactNode;
}


export interface CartItem {
  cartItemId: string; // Unique identifier for cart item
  id: string; // Product ID
  name: string;
  price: PriceData;
  imageUrl?: string;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export function getAvailableOptions(product: Product): { [key: string]: Set<string> } {
  if (!product.variants) return {};

  const options: { [key: string]: Set<string> } = {};

  product.variants.forEach(variant => {
    variant.options.forEach(option => {
      if (!options[option.name]) {
        options[option.name] = new Set();
      }
      options[option.name].add(option.value);
    });
  });

  return options;
}

export function findVariantByOptions(
  product: Product,
  selectedOptions: { [key: string]: string }
): ProductVariant | undefined {
  if (!product.variants) return undefined;

  return product.variants.find(variant => {
    return variant.options.every(option =>
      selectedOptions[option.name] === option.value
    );
  });
}

export type CreateProductRequest = Omit<Product, 'id'>;

// Type for the specific product paginated response
export type ProductsResponse = PaginatedResponse<Product>;