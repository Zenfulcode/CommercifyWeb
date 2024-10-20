import { Address, CartItem, Order, OrderDetails } from "@/types";
import axios from "axios";

const ordersApiUri = process.env.NEXT_PUBLIC_COMMERCIFY_API_URL;

export async function fetchOrders(page: number): Promise<{ orders: Order[], totalPages: number }> {
    page = page - 1;

    try {
        const response = await axios.get(`${ordersApiUri}/orders`, {
            params: { page },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const orders = response.data._embedded?.orderDTOes ?? [];
        const totalPages = orders.length ? response.data.page.totalPages : 1;

        return { orders, totalPages };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch orders');
    }
}

export async function fetchOrderDetails(orderId: number): Promise<OrderDetails> {
    try {
        const response = await axios.get(`${ordersApiUri}/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        const orderDetails = {
            ...response.data.order,
            orderLines: response.data.orderLines,
            totalAmount: response.data.totalPrice
        } as OrderDetails;

        return orderDetails;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details');
    }
}

type OrderLineItem = {
    productId: number;
    quantity: number;
}

export async function createOrder(userId: string, cartItems: CartItem[]): Promise<Order> {
    // Convert cart items to order line items
    const orderLines: OrderLineItem[] = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
    }));

    try {
        const response = await axios.post(`${ordersApiUri}/orders`, { userId, orderLines }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        });

        return response.data.order as Order;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to create order');
    }
}