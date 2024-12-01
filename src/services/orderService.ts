import { BaseApiService } from '@/types/apiBase';
import {
    CreateOrderRequest,
    CreateOrderResponse,
    CreatePaymentRequest,
    CreatePaymentResponse
} from '@/types/order';

class OrderService extends BaseApiService {
    private static instance: OrderService;

    private constructor() {
        super('http://localhost:6091/api/v1');
    }

    public static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    async createOrder(userId: string, orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
        return this.post<CreateOrderResponse>(`/orders/${userId}`, orderData, true);
    }

    async createMobilePayPayment(paymentData: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        return this.post<CreatePaymentResponse>('/payments/mobilepay/create', paymentData, true);
    }
}

export const orderService = OrderService.getInstance();