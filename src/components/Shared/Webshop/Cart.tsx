import React from 'react';
import { CartItem } from '@/types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartProps {
    cart: CartItem[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
}

const CartItemComponent: React.FC<{
    item: CartItem;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
}> = ({ item, onUpdateQuantity, onRemoveItem }) => (
    <div className="flex items-center justify-between py-4 border-b">
        {/* <div className="flex items-center space-x-4">
            <img src={item.imageUrl || '/placeholder-image.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.unitPrice.toFixed(2)}</p>
            </div>
        </div> */}
        <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded">
                <button
                    onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                >
                    <Minus size={16} />
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                >
                    <Plus size={16} />
                </button>
            </div>
            <p className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</p>
            <button
                onClick={() => onRemoveItem(item.productId)}
                className="text-red-500 hover:text-red-700"
            >
                <Trash2 size={20} />
            </button>
        </div>
    </div>
);

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-4">Looks like you haven&apos;t added any items to your cart yet.</p>
                <button
                    onClick={() => window.history.back()}
                    className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition duration-200"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            <div className="space-y-4">
                {cart.map(item => (
                    <CartItemComponent
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                    />
                ))}
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <button
                onClick={onCheckout}
                className="w-full mt-8 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-200"
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Cart;