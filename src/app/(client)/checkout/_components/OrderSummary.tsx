"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import React from 'react';
import placeholderImage from '@/public/placeholder.webp';
import { Separator } from '@/components/ui/separator';

const OrderSummary = () => {
    const { cart, totalPrice } = useCart();

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: 'DKK',
        }).format(amount);
    };

    return (
        <div className="lg:col-span-4">
            <Card className="sticky top-8">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[40vh]">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.cartItemId} className="flex gap-4">
                                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={item.imageUrl || placeholderImage}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                            width={64}
                                            height={64}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.name}</p>
                                        {item.selectedVariant && (
                                            <p className="text-sm text-muted-foreground">
                                                Size: {item.selectedVariant.options[0].value}
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="font-medium">
                                                {formatPrice(item.price.amount * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Separator className="mb-4" />
                    <div className="space-y-2 w-full">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>Free</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default OrderSummary