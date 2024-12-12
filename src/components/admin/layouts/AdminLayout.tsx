"use client";

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../shared/AppSidebar';
import { AuthProvider } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-col w-full p-4">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </AuthProvider>
    );
}