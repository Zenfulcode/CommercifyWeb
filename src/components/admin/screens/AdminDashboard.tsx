"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Package2,
    ShoppingCart,
    Users,
    DollarSign,
    Package,
    AlertCircle
} from "lucide-react";
import { useCommercify } from '@/context/CommercifyContext';
import { OrderDetails } from '@/types/order';
import { Product } from '@/types/product';

export default function AdminDashboard() {
    const { activeOrders, totalProducts, products, fetchOrderDetails } = useCommercify();

    const [recentOrders, setRecentOrders] = useState<OrderDetails[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchRecentOrders();
        fetchLowStockProducts();
    }, []);

    const fetchLowStockProducts = () => {
        const lowStock = products.filter(product => product.stock < 5);
        setLowStockProducts(lowStock);
    }

    const fetchRecentOrders = async () => {
        const orderDetails = await fetchOrderDetails({ size: 5 });
        setRecentOrders(orderDetails);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardContent className="flex items-center p-6">
                        <Package2 className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                            <h3 className="text-2xl font-bold">{totalProducts}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <ShoppingCart className="h-8 w-8 text-green-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                            <h3 className="text-2xl font-bold">{activeOrders()}</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <Users className="h-8 w-8 text-purple-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold">1,204</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center p-6">
                        <DollarSign className="h-8 w-8 text-yellow-500 mr-4" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">$12,426</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="orders" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="products" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Products
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {/* Recent Orders List last 5 orders */}
                                    {recentOrders.length === 0 && (
                                        <p className="text-center text-muted-foreground">No recent orders found</p>
                                    )}
                                    {recentOrders.map((orderDetails, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">Order #{orderDetails.id}</p>
                                                <p className="text-sm text-muted-foreground">{orderDetails!.orderLines.length} items • ${orderDetails.totalPrice}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{orderDetails.customerName ?? "NULL"}</p>
                                                <p className="text-sm text-muted-foreground">{orderDetails.createdAt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {/* Low Stock Products List */}
                                    {lowStockProducts.length === 0 && (
                                        <p className="text-center text-muted-foreground">No low stock products found</p>
                                    )}

                                    {lowStockProducts.map((product, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">Only {product.stock} units left</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-blue-500 hover:underline">
                                                Restock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {/* Recent Users List */}
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-medium">User Name</p>
                                                <p className="text-sm text-muted-foreground">user@example.com</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Joined 3 days ago</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}