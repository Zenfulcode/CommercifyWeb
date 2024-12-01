"use client";

import React, { createContext, useContext, useState } from 'react';
import { CheckoutState, CheckoutStep, CustomerInfo } from '@/types/checkout';

interface CheckoutContextType {
    state: CheckoutState;
    setStep: (step: CheckoutStep) => void;
    setIsGuest: (isGuest: boolean) => void;
    setCustomerInfo: (info: CustomerInfo) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CheckoutState>({
        isGuest: false,
        step: 'authentication',
    });

    const setStep = (step: CheckoutStep) => {
        setState(prev => ({ ...prev, step }));
    };

    const setIsGuest = (isGuest: boolean) => {
        setState(prev => ({ ...prev, isGuest }));
    };

    const setCustomerInfo = (customerInfo: CustomerInfo) => {
        setState(prev => ({ ...prev, customerInfo }));
    };

    return (
        <CheckoutContext.Provider value={{ state, setStep, setIsGuest, setCustomerInfo }}>
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}