export interface OrderLine {
    productId: number;
    quantity: number;
    variantId?: number;
}

export interface CreateOrderRequest {
    currency: string;
    orderLines: OrderLine[];
}

export interface Order {
    id: number;
    userId: number;
    totalPrice: number;
    currency: string;
    orderStatus: string;
    createdAt: string;
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
    paymentId: number;
    status: string;
    redirectUrl: string;
}