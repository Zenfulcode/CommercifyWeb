"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface LoginOptions {
    rememberMe: boolean;
}

const AuthContext = createContext<{
    user: AuthResponse['user'] | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (data: RegisterRequest, rememberMe?: boolean) => Promise<void>;
    login: (data: LoginRequest, options?: LoginOptions) => Promise<void>;
    logout: () => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            // Here you might want to validate the token with your backend
            // and fetch the user data
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    const register = async (data: RegisterRequest, rememberMe = false) => {
        try {
            setIsLoading(true);
            const response = await authService.register(data, rememberMe);
            setUser(response.user);
            toast({
                title: "Registration successful",
                description: "Welcome to our store!",
            });
            router.push('/');
        } catch (error) {
            toast({
                title: "Registration failed",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginRequest, options: LoginOptions = { rememberMe: false }) => {
        try {
            setIsLoading(true);
            const response = await authService.login(data, options);
            setUser(response.user);
            toast({
                title: "Login successful",
                description: "Welcome back!",
            });
            router.push('/');
        } catch (error) {
            toast({
                title: "Login failed",
                description: error instanceof Error ? error.message : "Please try again",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast({
            title: "Logged out",
            description: "You have been successfully logged out",
        });
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}