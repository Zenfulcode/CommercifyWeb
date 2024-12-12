"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    ChevronRight,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    submenu?: {
        title: string;
        href: string;
    }[];
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: <Package className="h-4 w-4" />,
        submenu: [
            { title: "All Products", href: "/admin/products" },
            { title: "Categories", href: "/admin/products/categories" },
            { title: "Inventory", href: "/admin/products/inventory" }
        ]
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: <ShoppingCart className="h-4 w-4" />,
        submenu: [
            { title: "All Orders", href: "/admin/orders" },
            { title: "Pending", href: "/admin/orders/pending" },
            { title: "Shipped", href: "/admin/orders/shipped" },
            { title: "Returns", href: "/admin/orders/returns" }
        ]
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: <Users className="h-4 w-4" />,
        submenu: [
            { title: "All Users", href: "/admin/users" },
            { title: "Roles", href: "/admin/users/roles" },
            { title: "Permissions", href: "/admin/users/permissions" }
        ]
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-4 w-4" />
    }
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleSubmenu = (title: string) => {
        setOpenItems(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        );
    };

    const NavContent = () => (
        <div className="px-3 py-4">
            <h2 className="mb-2 px-4 text-lg font-semibold">Commercify</h2>
            <div className="space-y-1">
                {navItems.map((item) => (
                    <div key={item.title}>
                        {item.submenu ? (
                            <div>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-between px-4 hover:bg-accent hover:text-accent-foreground",
                                        pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => toggleSubmenu(item.title)}
                                >
                                    <div className="flex items-center">
                                        {item.icon}
                                        <span className="ml-2">{item.title}</span>
                                    </div>
                                    <ChevronRight
                                        className={cn(
                                            "h-4 w-4 transition-transform",
                                            openItems.includes(item.title) && "rotate-90"
                                        )}
                                    />
                                </Button>
                                {openItems.includes(item.title) && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {item.submenu.map((subitem) => (
                                            <Link key={subitem.href} href={subitem.href}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start pl-8",
                                                        pathname === subitem.href && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    {subitem.title}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start px-4",
                                        pathname === item.href && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.title}</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="sm:flex-col md:flex-row flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
                <ScrollArea className="flex-1">
                    <NavContent />
                </ScrollArea>
            </aside>

            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                        <Menu className="h-12 w-12" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <ScrollArea className="h-full">
                        <NavContent />
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="px-4 flex-1">
                {children}
            </main>
        </div>
    );
}