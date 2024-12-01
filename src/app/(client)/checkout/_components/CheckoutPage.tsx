"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            toast({
                title: "Please log in",
                description: "You need to be logged in to checkout",
                variant: "destructive",
            });
            router.push('/auth/login');
            return;
        }

        try {
            setIsProcessing(true);

            // Create order lines from cart
            const orderLines = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                ...(item.selectedVariant && { variantId: item.selectedVariant.id }),
            }));

            // Create order
            const orderResponse = await orderService.createOrder(user.id, {
                currency: "DKK",
                orderLines,
            });

            // Create MobilePay payment
            const paymentResponse = await orderService.createMobilePayPayment({
                orderId: orderResponse.order.id.toString(),
                currency: "DKK",
                paymentMethod: "WALLET",
                returnUrl: `${window.location.origin}/checkout/confirmation`,
            });

            // Clear cart and redirect to MobilePay
            clearCart();
            window.location.href = paymentResponse.redirectUrl;

        } catch (error) {
            toast({
                title: "Checkout failed",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: 'DKK',
        }).format(amount);
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button onClick={() => router.push('/')}>
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review your items</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        {item.selectedVariant && (
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.selectedVariant.options[0].value}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        {formatPrice(item.price.amount * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Separator className="my-4" />
                            <div className="flex justify-between w-full">
                                <p className="font-bold">Total</p>
                                <p className="font-bold">{formatPrice(totalPrice)}</p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Payment */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment</CardTitle>
                            <CardDescription>Choose your payment method</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                You will be redirected to MobilePay to complete your payment
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Pay with MobilePay"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}