import { PaginatedResponse } from "./pagination";

export interface OrderLine {
    productId: string;
    quantity: number;
    variantId?: string;
}

export interface CreateOrderRequest {
    currency: string;
    orderLines: OrderLine[];
}

export interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    currency: string;
    orderStatus: string;
    createdAt: string;
}

export interface OrderDetails extends Order {
    orderLines: OrderLine[];
    customerName?: string;
    customerEmail?: string;
}

export interface CreateOrderResponse {
    order: Order;
    message: string;
}

export interface CreatePaymentRequest {
    orderId: string;
    currency: string;
    paymentMethod: 'WALLET';
    returnUrl: string;
}

export interface CreatePaymentResponse {
    paymentId: string;
    status: string;
    redirectUrl: string;
}

export type OrdersResponse = PaginatedResponse<Order>;
export type OrderDetailsResponse = PaginatedResponse<OrderDetails>;