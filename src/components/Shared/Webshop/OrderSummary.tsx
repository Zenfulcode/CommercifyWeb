import { CartItem } from '@/types';
import React from 'react'

type OrderSummaryProps = {
    cart: CartItem[];
}

const OrderSummary = ({ cart }: OrderSummaryProps) => {
    const total = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            {cart.map((item) => (
                <div key={item.productId} className="flex justify-between py-2 border-b">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between mt-4 font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    );
}

export default OrderSummary