"use client";

import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../shared/AppSidebar';
import { CommercifyProvider } from '@/context/CommercifyContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CommercifyProvider>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-col w-full p-4">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </CommercifyProvider>
    );
}