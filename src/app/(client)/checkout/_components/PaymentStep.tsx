"use client";

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Phone } from "lucide-react";
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

const PAYMENT_METHODS = {
    MOBILEPAY: 'WALLET',
    CARD: 'CARD'
} as const;

type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export function PaymentStep() {
    const { toast } = useToast();
    const { cart, clearCart } = useCart();
    const { state } = useCheckout();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>(PAYMENT_METHODS.MOBILEPAY);

    const canPay = React.useMemo(() => {
        return user !== null || (state.isGuest && state.customerInfo !== undefined);
    }, [user, state.isGuest, state.customerInfo]);

    const handlePayment = async () => {
        if (!canPay) {
            toast({
                title: "Cannot process payment",
                description: "Please complete your information before proceeding",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsProcessing(true);

            if (user === null) {
                throw new Error("User is not authenticated");
            }

            // Create order lines from cart
            const orderLines = cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                ...(item.selectedVariant && { variantId: item.selectedVariant.id }),
            }));

            console.log(orderLines);

            // Create order
            const orderResponse = await orderService.createOrder(user.id, {
                currency: "DKK",
                orderLines,
            });

            console.log(orderResponse);

            // Create payment based on selected method
            if (selectedMethod === PAYMENT_METHODS.MOBILEPAY) {
                const paymentResponse = await orderService.createMobilePayPayment({
                    orderId: orderResponse.order.id,
                    currency: "DKK",
                    paymentMethod: PAYMENT_METHODS.MOBILEPAY,
                    returnUrl: `${window.location.origin}/checkout/confirmation`,
                });

                // Clear cart and redirect to MobilePay
                clearCart();
                window.location.href = paymentResponse.redirectUrl;
            } else {
                toast({
                    title: "Not implemented",
                    description: "Card payment is not yet implemented.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Payment failed",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                    Choose how you would like to pay
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                    defaultValue={PAYMENT_METHODS.MOBILEPAY}
                    onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem
                                value={PAYMENT_METHODS.MOBILEPAY}
                                id="mobilepay"
                                className="peer sr-only"
                            />
                            <Label
                                htmlFor="mobilepay"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <Phone className="mb-3 h-6 w-6" />
                                <div className="space-y-1 text-center">
                                    <p className="font-medium leading-none">MobilePay</p>
                                    <p className="text-sm text-muted-foreground">
                                        Pay with MobilePay
                                    </p>
                                </div>
                            </Label>
                        </div>

                        <div>
                            <RadioGroupItem
                                value={PAYMENT_METHODS.CARD}
                                id="card"
                                className="peer sr-only"
                                disabled
                            />
                            <Label
                                htmlFor="card"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary opacity-50 cursor-not-allowed"
                            >
                                <CreditCard className="mb-3 h-6 w-6" />
                                <div className="space-y-1 text-center">
                                    <p className="font-medium leading-none">Card Payment</p>
                                    <p className="text-sm text-muted-foreground">
                                        Coming soon
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </div>
                </RadioGroup>

                <div className="flex justify-between pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing || !canPay}
                    >
                        {!canPay
                            ? "Complete Information First"
                            : isProcessing
                                ? "Processing..."
                                : "Pay Now"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}