import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronUp, User2 } from "lucide-react";
import Link from "next/link";


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

export function AppSidebar() {
    const { logout } = useAuth();

    const dashboard = navItems[0];
    const settings = navItems[navItems.length - 1];

    return (
        <Sidebar>
            <h1 className="text-xl font-bold text-center py-4">Commercify</h1>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={dashboard.href}>
                                    {dashboard.icon}{dashboard.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <SidebarMenu>
                        {navItems.slice(1, -1).map((item) => (
                            <Collapsible
                                key={item.title}
                                defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.icon}{item.title}
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.submenu?.map((subitem, subindex) => (
                                                <SidebarMenuSubItem key={subindex}>
                                                    <Link href={subitem.href} passHref>
                                                        {subitem.title}
                                                    </Link>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={settings.href}>
                                    {settings.icon}{settings.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SidebarMenuButton onClick={logout}>
                                        Sign out
                                    </SidebarMenuButton>
                                    {/* <span>Sign out</span> */}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
