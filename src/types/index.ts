export interface Address {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface User {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    roles: string[];
}

export interface Product {
    productId: number;
    name: string;
    description: string;
    unitPrice: number;
    currency: string;
    stock: number;
    active: boolean;
}

export interface CartItem extends Product {
    quantity: number
}

export interface Order {
    orderId: number;
    userId: number;
    orderStatus: string;
    createdAt: string;
    totalAmount: number;
    action: string;
}

export interface OrderLine {
    orderlineId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    product: Product | null;
}

export interface OrderDetails extends Order {
    orderLines: OrderLine[];
}

export interface ServiceStatus {
    id: string;
    name: string;
    status: 'up' | 'down' | 'warning';
    uptime: string;
    cpu: number;
    memory: number;
    requests: number;
}

export interface SystemOverview {
    totalUsers: number;
    activeUsers: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
}