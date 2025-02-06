// Example usage in a product list component
"use client";

import { useCommercify } from "@/context/CommercifyContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";

export default function ProductListView() {
    const {
        products,
        totalProducts,
        isLoadingProducts,
        deleteProduct,
        refreshProducts,
    } = useCommercify();
    const router = useRouter();

    if (isLoadingProducts) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Products ({totalProducts})</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your products and inventory
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={refreshProducts}
                    >
                        Refresh
                    </Button>
                    <Link href="/admin/products/new">
                        <Button className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: product.price.currency,
                                }).format(product.price.amount)}
                            </TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => deleteProduct(product.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}