"use client";

import React from 'react';
import { AuthenticationStep } from './AuthenticationStep';
import { StepIndicator } from './CheckoutSteps';
import { useCheckout } from '@/context/CheckoutContext';
import OrderSummary from './OrderSummary';
import { InformationStep } from './InformationStep';
import { PaymentStep } from './PaymentStep';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Checkout() {
    const router = useRouter();
    const { state } = useCheckout();
    const { cart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto py-16">
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardTitle>Your Cart is Empty</CardTitle>
                        <CardDescription>
                            Add some items to your cart to proceed with checkout
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push('/')}>
                            Browse Products
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const currentStepIndex = {
        'authentication': 0,
        'information': 1,
        'payment': 2,
    }[state.step];

    return (
        <div className="container mx-auto py-8">
            <StepIndicator currentStep={currentStepIndex} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                <div className="lg:col-span-8">
                    {state.step === 'authentication' && <AuthenticationStep />}
                    {state.step === 'information' && <InformationStep />}
                    {state.step === 'payment' && <PaymentStep />}
                </div>

                <div className="lg:col-span-4">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}