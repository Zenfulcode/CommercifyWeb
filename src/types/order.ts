import { Address } from "./auth";
import { PaginatedResponse } from "./pagination";
import { ProductOption } from "./product";

export interface OrderLine {
    productId: string;
    quantity: number;
    variantId?: string;
}

export interface CreateOrderRequest {
    currency: string;
    orderLines: OrderLine[];
    shippingAddress: Address;
    billingAddress?: Address;
}

export interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    currency: string;
    orderStatus: 'pending' | 'paid' | 'shipped' |'completed' | 'cancelled'| 'failed' | 'returned';
    createdAt: string;
    action?: React.ReactNode;
}

export interface OrderDetails extends Order {
    orderLines: OrderLineDetails[];
    updatedAt: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: Address;
    billingAddress: Address;
}

export interface OrderLineDetails extends OrderLine {
    name: string,
    description: string,
    quantity: number,
    unitPrice: number,
    imageUrl?: string,
    totalAmount?: number,
    variant?: {
        id: string,
        sku: string,
        options: ProductOption[]
    }
}

export interface CreateOrderResponse {
    order: Order;
    message: string;
}

export interface CreatePaymentRequest {
    orderId: string;
    currency: string;
    paymentMethod: 'WALLET' | 'CARD';
    returnUrl: string;
    phoneNumber?: string;
}

export interface CreatePaymentResponse {
    paymentId: string;
    status: string;
    redirectUrl: string;
}

export type OrdersResponse = PaginatedResponse<Order>;
export type OrderDetailsResponse = PaginatedResponse<OrderDetails>;