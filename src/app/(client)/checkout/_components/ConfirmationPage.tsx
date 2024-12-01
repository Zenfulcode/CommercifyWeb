"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

export function ConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const success = searchParams.get('success') === 'true';
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto py-16">
            <Card className="max-w-md mx-auto text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {success ? (
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {success ? 'Order Confirmed' : 'Payment Failed'}
                    </CardTitle>
                    {orderId && success && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Order #{orderId}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {success
                            ? 'Thank you for your order. You will receive a confirmation email shortly.'
                            : 'Sorry, your payment was not successful. Please try again.'}
                    </p>
                    <div className="flex flex-col gap-2">
                        {!success && (
                            <Button
                                variant="default"
                                onClick={() => router.push('/checkout')}
                            >
                                Try Again
                            </Button>
                        )}
                        <Button
                            variant={success ? "default" : "secondary"}
                            onClick={() => router.push('/')}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}