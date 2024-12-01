"use client";

import { useToast } from '@/hooks/use-toast';
import { cartToasts } from '@/lib/cartToasts';
import { CartItem, Product, ProductVariant } from '@/types/product';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, selectedVariant?: ProductVariant) => void;
    removeFromCart: (cartItemId: string) => void;
    updateCartItemQuantity: (cartItemId: string, newQuantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const generateCartItemId = (productId: number, variantSku?: string) => {
        return variantSku ? `${productId}-${variantSku}` : `${productId}`;
    };

    const addToCart = (product: Product, selectedVariant?: ProductVariant) => {
        setCart(currentCart => {
            const cartItemId = generateCartItemId(product.id, selectedVariant?.sku);
            const existingItem = currentCart.find(item => item.cartItemId === cartItemId);

            if (existingItem) {
                toast(cartToasts.updatedQuantity(product.name, existingItem.quantity + 1));
                return currentCart.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const variantDisplay = selectedVariant?.options
                    .map(opt => opt.value)
                    .join(', ');
                toast(cartToasts.addedToCart(product.name, variantDisplay));
                
                const newItem: CartItem = {
                    cartItemId,
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    selectedVariant,
                    quantity: 1
                };
                return [...currentCart, newItem];
            }
        });
    };

    const removeFromCart = (cartItemId: string) => {
        const item = cart.find(item => item.cartItemId === cartItemId);
        if (item) {
            toast(cartToasts.removedFromCart(item.name));
        }
        setCart(currentCart => currentCart.filter(item => item.cartItemId !== cartItemId));
    };

    const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
        setCart(currentCart => {
            const updatedCart = currentCart.map(item =>
                item.cartItemId === cartItemId
                    ? { ...item, quantity: Math.max(0, newQuantity) }
                    : item
            ).filter(item => item.quantity > 0);

            const item = currentCart.find(item => item.cartItemId === cartItemId);
            if (item && newQuantity > 0) {
                toast(cartToasts.updatedQuantity(item.name, newQuantity));
            } else if (item) {
                toast(cartToasts.removedFromCart(item.name));
            }

            return updatedCart;
        });
    };

    const clearCart = () => {
        toast(cartToasts.cartCleared());
        setCart([]);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price.amount * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}