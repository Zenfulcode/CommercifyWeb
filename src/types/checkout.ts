import { Address } from "./auth";

export type CheckoutStep = 'authentication' | 'information' | 'payment';

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    shippingAddress: Address;
    billingAddress?: Address;
}

export interface CheckoutState {
    isGuest: boolean;
    customerInfo?: CustomerInfo;
    step: CheckoutStep;
}