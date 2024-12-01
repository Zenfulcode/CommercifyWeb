"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import placeholderImage from '@/public/placeholder.webp';
import { CartItem } from '@/types/product';

export const CartSheet = () => {
    const { cart, totalItems, totalPrice, updateCartItemQuantity, removeFromCart } = useCart();

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getVariantDisplay = (item: CartItem) => {
        if (!item.selectedVariant) return null;

        return item.selectedVariant.options.map(option => (
            <Badge
                key={`${option.name}-${option.value}`}
                variant="secondary"
                className="mr-2"
            >
                {option.name}: {option.value}
            </Badge>
        ));
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                        <Badge
                            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                            variant="destructive"
                        >
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Your cart is empty
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.cartItemId}
                                    className="flex gap-4 py-4 border-b"
                                >
                                    <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                                        <Image
                                            src={item.imageUrl || placeholderImage}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                            width={80}
                                            height={80}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{item.name}</h3>
                                                <div className="mt-1 space-y-1">
                                                    {getVariantDisplay(item)}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {formatPrice(item.price.amount, item.price.currency)} each
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.cartItemId)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity - 1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateCartItemQuantity(item.cartItemId, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {formatPrice(item.price.amount * item.quantity, item.price.currency)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t pt-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(totalPrice, cart[0].price.currency)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>{formatPrice(totalPrice, cart[0].price.currency)}</span>
                            </div>
                        </div>
                        <Button className="w-full">
                            Checkout ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};