// Example usage in a product list component
"use client";

import { useCommercify } from "@/context/CommercifyContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";

export default function ProductList() {
    const {
        products,
        totalProducts,
        isLoadingProducts,
        deleteProduct,
        refreshProducts,
    } = useCommercify();

    if (isLoadingProducts) {
        return <div>Loading...</div>;
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
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
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