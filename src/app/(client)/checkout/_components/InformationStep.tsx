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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useToast } from '@/hooks/use-toast';
import { RegisterRequest } from '@/types/auth';

const addressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Region is required"),
    zipCode: z.string().min(4, "Zip code must be at least 4 characters"),
    country: z.string().min(1, "Country is required"),
});

const informationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email(),
    shippingAddress: addressSchema,
    useSameForBilling: z.boolean().default(true),
    billingAddress: addressSchema.optional(),
    wantsToRegister: z.boolean().default(false),
    password: z.string().min(6).optional(),
});

function AddressFields({ prefix, disabled = false }: { prefix: 'shippingAddress' | 'billingAddress', disabled?: boolean }) {
    return (
        <div className="space-y-4">
            <FormField
                name={`${prefix}.street`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={disabled} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name={`${prefix}.city`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name={`${prefix}.zipCode`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                name={`${prefix}.state`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>State/Region</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={disabled} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name={`${prefix}.country`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={disabled} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}

export function InformationStep() {
    const { user, register } = useAuth();
    const { state, setStep, setCustomerInfo } = useCheckout();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<z.infer<typeof informationSchema>>({
        resolver: zodResolver(informationSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            useSameForBilling: true,
            wantsToRegister: false,
            shippingAddress: {
                country: 'Danmark',
            },
        },
    });

    const wantsToRegister = form.watch('wantsToRegister');
    const useSameForBilling = form.watch('useSameForBilling');

    const onSubmit = async (data: z.infer<typeof informationSchema>) => {
        try {
            setIsLoading(true);

            if (state.isGuest) {
                const registerRequest: RegisterRequest = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    isGuest: true,
                };

                const toastTitle = wantsToRegister ? "Account created" : "Guest checkout";
                const toastMessage = wantsToRegister ?
                    "Your account has been created successfully" :
                    "You will continue as a guest";

                if (wantsToRegister)
                    registerRequest.password = data.password;

                await register(registerRequest);

                toast({
                    title: toastTitle,
                    description: toastMessage
                });
            }

            setCustomerInfo({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                shippingAddress: data.shippingAddress,
                billingAddress: data.useSameForBilling ? undefined : data.billingAddress!,
            });

            setStep('payment');
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                    {state.isGuest
                        ? "Enter your shipping details"
                        : "Confirm your shipping details"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={!!user} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={!!user} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} disabled={!!user} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Shipping Address</h3>
                            <AddressFields prefix="shippingAddress" />
                        </div>

                        {/* Billing Address */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-lg">Billing Address</h3>
                                <FormField
                                    control={form.control}
                                    name="useSameForBilling"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm items-center font-normal">
                                                Same as shipping address
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {!useSameForBilling && (
                                <AddressFields prefix="billingAddress" />
                            )}
                        </div>

                        {/* Registration Option for Guests */}
                        {state.isGuest && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="wantsToRegister"
                                    render={({ field }) => (
                                        <FormItem className="flex items-start space-x-3">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Create an account for faster checkout
                                                </FormLabel>
                                                <FormDescription>
                                                    Save your information for future purchases
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {wantsToRegister && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('authentication')}
                            >
                                Back
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Processing..." : "Continue to Payment"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}