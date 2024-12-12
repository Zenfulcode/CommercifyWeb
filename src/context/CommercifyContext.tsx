// src/context/CommercifyContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CreateProductRequest } from '@/types/product';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { PaginationParams } from '@/types/pagination';
import { Order, OrderDetails } from '@/types/order';
import { productService } from '@/services/productsService';

// Types for the context
interface CommercifyContextState {
    // Products
    products: Product[];
    totalProducts: number;
    isLoadingProducts: boolean;
    // Orders
    orders: Order[]; // Replace with proper Order type
    totalOrders: number;
    isLoadingOrders: boolean;
    // Users
    // users: any[]; // Replace with proper User type
    // totalUsers: number;
    // isLoadingUsers: boolean;
}

interface CommercifyContextValue extends CommercifyContextState {
    // Product actions
    loadProducts: (params?: PaginationParams) => Promise<void>;
    createProduct: (product: CreateProductRequest) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Order actions
    loadOrders: (params?: PaginationParams) => Promise<void>;
    activeOrders: () => number;
    fetchOrderDetailsById: (id: string) => Promise<OrderDetails | null>;
    fetchOrderDetails: (params?: PaginationParams) => Promise<OrderDetails[]>;
    // updateOrderStatus: (orderId: string, status: string) => Promise<void>;

    // User actions
    // loadUsers: (params?: PaginationParams) => Promise<void>;

    // Refresh actions
    refreshProducts: () => Promise<void>;
    refreshOrders: () => Promise<void>;
    // refreshUsers: () => Promise<void>;
}

const CommercifyContext = createContext<CommercifyContextValue | undefined>(undefined);

export function CommercifyProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Users state
    // const [users, setUsers] = useState<User[]>([]);
    // const [totalUsers, setTotalUsers] = useState(0);
    // const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Products functions
    const loadProducts = async (params?: PaginationParams) => {
        try {
            setIsLoadingProducts(true);
            const response = await productService.getAllProducts(params);
            setProducts(response._embedded.productViewModels);
            setTotalProducts(response.page.totalElements);
        } catch (error) {
            toast({
                title: "Error loading products",
                description: error instanceof Error ? error.message : "Failed to load products",
                variant: "destructive",
            });
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const createProduct = async (product: CreateProductRequest) => {
        try {
            await productService.createProduct(product);
            toast({
                title: "Product created",
                description: "Product has been created successfully",
            });
            await refreshProducts();
        } catch (error) {
            toast({
                title: "Error creating product",
                description: error instanceof Error ? error.message : "Failed to create product",
                variant: "destructive",
            });
        }
    };

    const updateProduct = async (id: string, product: Partial<Product>) => {
        try {
            await productService.updateProduct(id, product);
            toast({
                title: "Product updated",
                description: "Product has been updated successfully",
            });
            await refreshProducts();
        } catch (error) {
            toast({
                title: "Error updating product",
                description: error instanceof Error ? error.message : "Failed to update product",
                variant: "destructive",
            });
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await productService.deleteProduct(id);
            toast({
                title: "Product deleted",
                description: "Product has been deleted successfully",
            });
            await refreshProducts();
        } catch (error) {
            toast({
                title: "Error deleting product",
                description: error instanceof Error ? error.message : "Failed to delete product",
                variant: "destructive",
            });
        }
    };

    // Orders functions
    const loadOrders = async (params?: PaginationParams) => {
        try {
            setIsLoadingOrders(true);
            const response = await orderService.getAllOrders(params);
            setOrders(response._embedded.orderViewModels);
            setTotalOrders(response.page.totalElements);
        } catch (error) {
            toast({
                title: "Error loading orders",
                description: error instanceof Error ? error.message : "Failed to load orders",
                variant: "destructive",
            });
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const activeOrders = () => {
        if (orders.length === 0) return 0;
        return orders.filter(order => order.orderStatus === 'PAID').length;
    };

    const fetchOrderDetailsById = async (id: string) => {
        try {
            return await orderService.getOrderById(id);
        } catch (error) {
            toast({
                title: "Error loading order details",
                description: error instanceof Error ? error.message : "Failed to load order details",
                variant: "destructive",
            });
        }

        return null;
    }

    const fetchOrderDetails = async (params?: PaginationParams) => {
        try {
            const response = await orderService.getOrderDetails(params);
            return response._embedded.orderViewModels;
        } catch (error) {
            toast({
                title: "Error loading order details",
                description: error instanceof Error ? error.message : "Failed to load order details",
                variant: "destructive",
            });
        }

        return [];
    }

    // TODO: Implement order status update logic here
    // const updateOrderStatus = async (orderId: string, status: string) => {
    //     try {
    //         await orderService.updateOrderStatus(orderId, status);
    //         toast({
    //             title: "Order updated",
    //             description: "Order status has been updated successfully",
    //         });
    //         await refreshOrders();
    //     } catch (error) {
    //         toast({
    //             title: "Error updating order",
    //             description: error instanceof Error ? error.message : "Failed to update order",
    //             variant: "destructive",
    //         });
    //     }
    // };

    // Users functions
    // const loadUsers = async (params?: PaginationParams) => {
    //     try {
    //         setIsLoadingUsers(true);
    //         // Implement user loading logic here
    //         // const response = await userService.getUsers(params);
    //         // setUsers(response.users);
    //         // setTotalUsers(response.total);
    //     } catch (error) {
    //         toast({
    //             title: "Error loading users",
    //             description: error instanceof Error ? error.message : "Failed to load users",
    //             variant: "destructive",
    //         });
    //     } finally {
    //         setIsLoadingUsers(false);
    //     }
    // };

    // Refresh functions
    const refreshProducts = () => loadProducts();
    const refreshOrders = () => loadOrders();
    // const refreshUsers = () => loadUsers();

    // Initial load
    useEffect(() => {
        loadProducts();
        loadOrders();
        // loadUsers();
    }, []);

    return (
        <CommercifyContext.Provider
            value={{
                // State
                products,
                totalProducts,
                isLoadingProducts,
                orders,
                totalOrders,
                isLoadingOrders,
                // users,
                // totalUsers,
                // isLoadingUsers,

                // Actions
                loadProducts,
                createProduct,
                updateProduct,
                deleteProduct,
                loadOrders,
                activeOrders,
                fetchOrderDetailsById,
                fetchOrderDetails,
                // updateOrderStatus,
                // loadUsers,

                // Refresh functions
                refreshProducts,
                refreshOrders,
                // refreshUsers,
            }}
        >
            {children}
        </CommercifyContext.Provider>
    );
}

export function useCommercify() {
    const context = useContext(CommercifyContext);
    if (context === undefined) {
        throw new Error('useCommercify must be used within an AdminProvider');
    }
    return context;
}