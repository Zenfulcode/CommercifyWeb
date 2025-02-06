"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { OrderDetails } from '@/types/order';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { ApiError } from '@/types/apiBase';

export function ConfirmationPage() {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);

            if (!orderId) {
                setError('No order ID found');
                setIsLoading(false);
                return;
            }

            try {
                const details = await orderService.getOrderById(orderId);
                if (!details) {
                    setError('Order details not found');
                    return;
                }

                if (!user) return setError('User not found');

                if (details.userId !== user.id) {
                    setError('You do not have permission to view this order');
                    return;
                }

                setOrderDetails(details);
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                if (err instanceof ApiError) {
                    setError('Failed to fetch order details: '+ err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const success = orderDetails?.orderStatus !== 'failed' && orderDetails?.orderStatus !== 'cancelled';

    if (isLoading) {
        return (
            <div className="container mx-auto py-16 text-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-16 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16">
            <Card className="max-w-md mx-auto text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {success ? (
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {orderDetails?.orderStatus ? 'Order Confirmed' : 'Payment Failed'}
                    </CardTitle>
                    {orderId && success && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Order #{orderId}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {success
                            ? 'Thank you for your order. You will receive a confirmation email shortly.'
                            : 'Sorry, your payment was not successful. Please try again.'}
                    </p>
                    <div className="flex flex-col gap-2">
                        {!success && (
                            <Button
                                variant="default"
                                onClick={() => router.push('/checkout')}
                            >
                                Try Again
                            </Button>
                        )}
                        <Button
                            variant={success ? "default" : "secondary"}
                            onClick={() => router.push('/')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}