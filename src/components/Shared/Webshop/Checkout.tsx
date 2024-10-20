
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/ordersApi';
import { Address, CartItem } from '@/types';
import React, { useState } from 'react'
import AddressForm from '../Form/AddressForm';
import OrderSummary from './OrderSummary';
import PaymentProvider from './PaymentProvider';
import FormInput from '../Form/FormInput';

type CheckoutProps = {
    cart: CartItem[];
    onCheckoutComplete: () => void;
}

const Checkout = ({ cart, onCheckoutComplete }: CheckoutProps) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [userInfo, setUserInfo] = useState({
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
    });
    const [billingAddress, setBillingAddress] = useState<Address>({
        firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', zipCode: '', country: ''
    });
    const [shippingAddress, setShippingAddress] = useState<Address>({
        firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', zipCode: '', country: ''
    });
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, setAddress: React.Dispatch<React.SetStateAction<Address>>) => {
        setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userInfo.password !== userInfo.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await createOrder(user ? user.userId.toString() : userInfo.email, cart);
            onCheckoutComplete();
        } catch (error) {
            console.error('Failed to create order:', error);
            alert('Failed to create order. Please try again.');
        }
    };

    const steps = [
        {
            title: 'User Information',
            content: (
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information</h3>
                    <FormInput label="Email" name="email" type="email" value={userInfo.email} onChange={handleUserInfoChange} required />
                    <FormInput label="First Name" name="firstName" value={userInfo.firstName} onChange={handleUserInfoChange} required />
                    <FormInput label="Last Name" name="lastName" value={userInfo.lastName} onChange={handleUserInfoChange} required />
                    <FormInput label="Password" name="password" type="password" value={userInfo.password} onChange={handleUserInfoChange} required />
                    <FormInput label="Confirm Password" name="confirmPassword" type="password" value={userInfo.confirmPassword} onChange={handleUserInfoChange} required />
                </div>
            )
        },
        {
            title: 'Billing Information',
            content: <AddressForm address={billingAddress} onChange={(e) => handleAddressChange(e, setBillingAddress)} title="Billing Address" />
        },
        {
            title: 'Shipping Information',
            content: (
                <>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={sameAsBilling}
                                onChange={() => setSameAsBilling(!sameAsBilling)}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Shipping address same as billing</span>
                        </label>
                    </div>
                    {!sameAsBilling && <AddressForm address={shippingAddress} onChange={(e) => handleAddressChange(e, setShippingAddress)} title="Shipping Address" />}
                </>
            )
        },
        {
            title: 'Payment',
            content: (
                <>
                    <PaymentProvider method={paymentMethod} setMethod={setPaymentMethod} />
                    <OrderSummary cart={cart} />
                </>
            )
        }
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h2>
            <form onSubmit={handleSubmit}>
                {steps.map((s, index) => (
                    <div key={index} className={step === index + 1 ? '' : 'hidden'}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{s.title}</h3>
                        {s.content}
                    </div>
                ))}
                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep(step - 1)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Previous
                        </button>
                    )}
                    {step < steps.length ? (
                        <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ml-auto"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 ml-auto"
                        >
                            Place Order
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Checkout