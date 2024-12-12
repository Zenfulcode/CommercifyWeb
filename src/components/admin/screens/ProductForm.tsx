"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, CopyPlus, Loader2, Plus, X } from "lucide-react";
import { useCommercify } from '@/context/CommercifyContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const variantOptionSchema = z.object({
    name: z.string().min(1, "Option name is required"),
    value: z.string().min(1, "Option value is required"),
});

const variantSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    stock: z.number().min(0, "Stock cannot be negative"),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    unitPrice: z.number().min(0, "Price cannot be negative"),
    options: z.array(variantOptionSchema).min(1, "At least one option is required"),
});

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    stock: z.number().min(0, "Stock cannot be negative"),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    active: z.boolean(),
    price: z.object({
        currency: z.string().min(1, "Currency is required"),
        amount: z.number().min(0, "Price cannot be negative"),
    }),
    variants: z.array(variantSchema),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const { products, createProduct, updateProduct, isLoadingProducts } = useCommercify();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [openVariants, setOpenVariants] = React.useState<number[]>([]);

    const isEditing = !!productId;
    const product = isEditing ? products.find(p => p.id === productId) : null;

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            stock: 0,
            imageUrl: '',
            active: true,
            price: {
                currency: 'DKK',
                amount: 0,
            },
            variants: [],
        },
    });

    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        name: "variants",
        control: form.control,
    });

    const toggleVariant = (index: number) => {
        setOpenVariants(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Update form when product data is loaded in edit mode
    React.useEffect(() => {
        if (isEditing && product) {
            form.reset({
                name: product.name,
                description: product.description,
                stock: product.stock,
                imageUrl: product.imageUrl,
                active: product.active,
                price: {
                    currency: product.price.currency,
                    amount: product.price.amount,
                },
                variants: product.variants.map(variant => ({
                    sku: variant.sku,
                    stock: variant.options.length > 0 ? 0 : product.stock,
                    imageUrl: variant.imageUrl || '',
                    unitPrice: variant.unitPrice || product.price.amount,
                    options: variant.options,
                })),
            });
            // Open first variant by default if exists
            if (product.variants.length > 0) {
                setOpenVariants([0]);
            }
        }
    }, [product, form, isEditing]);

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setIsSubmitting(true);

            if (isEditing) {
                await updateProduct(productId, {
                    ...data,
                    id: productId,
                });
                toast({
                    title: "Product updated",
                    description: "Product has been updated successfully",
                });
            } else {
                await createProduct(data);
                toast({
                    title: "Product created",
                    description: "Product has been created successfully",
                });
            }

            router.push('/admin/products');
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} product`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state when fetching product data in edit mode
    if (isEditing && isLoadingProducts) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Show error state if product not found in edit mode
    if (isEditing && !product) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <p className="text-lg text-muted-foreground">Product not found</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const addNewVariant = () => {
        const newVariantIndex = variantFields.length;
        appendVariant({
            sku: `${form.getValues('name').toLowerCase().replace(/\s+/g, '-')}-variant-${newVariantIndex + 1}`,
            stock: 0,
            imageUrl: '',
            unitPrice: form.getValues('price.amount'),
            options: [{ name: '', value: '' }],
        });
        setOpenVariants(prev => [...prev, newVariantIndex]);
    };

    const duplicateVariant = (index: number) => {
        const variant = form.getValues(`variants.${index}`);
        const newVariantIndex = variantFields.length;
        appendVariant({
            ...variant,
            sku: `${variant.sku}-copy`,
        });
        setOpenVariants(prev => [...prev, newVariantIndex]);
    };

    const VariantManager = () => (
        <Card className="mt-8">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Product Variants</CardTitle>
                        <CardDescription>
                            Manage variants of your product
                        </CardDescription>
                    </div>
                    <Button onClick={addNewVariant} type="button">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {variantFields.map((variant, index) => (
                    <Collapsible
                        key={variant.id}
                        open={openVariants.includes(index)}
                        onOpenChange={() => toggleVariant(index)}
                        className="border rounded-lg"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <CollapsibleTrigger className="hover:opacity-75">
                                        {openVariants.includes(index) ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </CollapsibleTrigger>
                                    <h4 className="text-sm font-semibold">
                                        Variant {index + 1}
                                    </h4>
                                    <Badge variant="secondary" className="ml-2">
                                        {form.watch(`variants.${index}.sku`)}
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => duplicateVariant(index)}
                                    >
                                        <CopyPlus className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete this variant? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => removeVariant(index)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                        <CollapsibleContent>
                            <div className="p-4 pt-0 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.sku`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SKU</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (DKK)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={e => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.stock`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={e => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${index}.imageUrl`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Options section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-semibold">Options</h5>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const currentOptions = form.getValues(`variants.${index}.options`);
                                                form.setValue(`variants.${index}.options`, [
                                                    ...currentOptions,
                                                    { name: '', value: '' }
                                                ]);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Option
                                        </Button>
                                    </div>
                                    {form.watch(`variants.${index}.options`)?.map((_, optionIndex) => (
                                        <div key={optionIndex} className="flex items-end gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.options.${optionIndex}.name`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g., Size, Color" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variants.${index}.options.${optionIndex}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel>Value</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g., Large, Red" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="mb-2"
                                                onClick={() => {
                                                    const currentOptions = form.getValues(`variants.${index}.options`);
                                                    form.setValue(
                                                        `variants.${index}.options`,
                                                        currentOptions.filter((_, i) => i !== optionIndex)
                                                    );
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto py-8">
            <div>
                <h3 className="text-2xl font-bold">
                    {isEditing ? 'Edit Product' : 'Create New Product'}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {isEditing ? 'Make changes to your product' : 'Add a new product to your store'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>
                                {isEditing ? 'Update your product details' : 'Enter your product details'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status Switch - Only show in edit mode */}
                            {isEditing && (
                                <FormField
                                    control={form.control}
                                    name="active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Product Status</FormLabel>
                                                <FormDescription>
                                                    Activate or deactivate this product
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a detailed description of your product
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price.amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price (DKK)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a valid URL for the product image
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? (isEditing ? "Saving..." : "Creating...")
                                : (isEditing ? "Save Changes" : "Create Product")
                            }
                        </Button>
                    </div>

                    <VariantManager />
                </form>
            </Form>
        </div>
    );
}