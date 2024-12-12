import { BaseApiService } from '@/types/apiBase';
import {
    CreateOrderRequest,
    CreateOrderResponse,
    CreatePaymentRequest,
    CreatePaymentResponse,
    Order,
    OrderDetails,
    OrderDetailsResponse,
    OrdersResponse
} from '@/types/order';
import { PaginationParams } from '@/types/pagination';

class OrderService extends BaseApiService {
    private static instance: OrderService;
    private readonly EMBEDDED_KEY = 'orderViewModels';

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

    async getAllOrders(params?: PaginationParams): Promise<OrdersResponse> {
        return this.fetchWithPagination<Order>(
            '/orders',
            this.EMBEDDED_KEY,
            params,
            true
        );
    }

    async getOrderDetails(params?: PaginationParams): Promise<OrderDetailsResponse> {
        return this.fetchWithPagination<OrderDetails>(
            '/orderdetails',
            this.EMBEDDED_KEY,
            params,
            true
        );
    }

    async getOrderById(orderId: string): Promise<OrderDetails> {
        return this.get<OrderDetails>(`/orders/${orderId}`, true);
    }
}

export const orderService = OrderService.getInstance();