/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Checkout from '@/components/Shared/Webshop/Checkout';
import Cart from '@/components/Shared/Webshop/Cart';

export default function CheckoutPage() {
    const { cart, clearCart, removeFromCart, updateCartItemQuantity } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = () => {
        setIsCheckingOut(true);
    };

    const handleCheckoutComplete = () => {
        clearCart();
        setIsCheckingOut(false);
        // Redirect to order confirmation page or show a success message
    };

    return (
        <div className="container mx-auto p-4">
            {!isCheckingOut ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

                    <Cart cart={cart} onRemoveItem={removeFromCart} onCheckout={handleCheckout} onUpdateQuantity={updateCartItemQuantity} />
                </>
            ) : (
                <Checkout cart={cart} onCheckoutComplete={handleCheckoutComplete} />
            )}
        </div>
    );
}