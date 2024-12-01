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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from '@/context/AuthContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AuthenticationStep() {
    const { isAuthenticated, login } = useAuth();
    const { setStep, setIsGuest } = useCheckout();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    console.log(isAuthenticated);

    if (isAuthenticated) {
        setStep('information');
        return null;
    }

    const handleLogin = async (data: z.infer<typeof loginSchema>) => {
        try {
            setIsLoading(true);
            await login(data);
            setIsGuest(false);
            setStep('information');
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Login failed",
                    description: "Invalid email or password",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestCheckout = () => {
        setIsGuest(true);
        setStep('information');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    Sign in to your account or continue as a guest
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGuestCheckout}
                    disabled={isLoading}
                >
                    Continue as Guest
                </Button>
            </CardContent>
        </Card>
    );
}