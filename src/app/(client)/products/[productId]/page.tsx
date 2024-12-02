"use client";

import React, { useEffect, useState } from 'react';
import { Product, ProductVariant } from '@/types/product';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';
import placeholderImage from '@/public/placeholder.webp';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, ChevronLeft, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productApi } from '@/services/productsService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetails({ params }: { params: { productId: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0] || undefined
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.productId) {
        setError('Product not found');
        return;
      }

      setIsLoading(true);

      try {
        const response = await productApi.getProductById(params.productId);
        setProduct(response);
        setSelectedVariant(response.variants?.[0] || null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleAddToCart = () => {
    if (!product) {
      setError('Product not found');
      return;
    }

    if (product.variants.length > 0 && !selectedVariant) {
      toast({
        title: 'Please select a size',
        description: 'Please select a size before adding to cart',
        variant: 'destructive'
      });
      return;
    }

    addToCart(product, selectedVariant);
  };

  if (error || !product) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Product not found'}
          </AlertDescription>
        </Alert>
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-4"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              products
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="object-cover object-center w-full h-full"
            width={600}
            height={600}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {formatPrice(product.price.amount, product.price.currency)}
            </span>
            {product.stock === 0 ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <Badge variant="default">In Stock</Badge>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="w-full max-w-xs">
              <Select
                value={selectedVariant?.sku}
                onValueChange={(value) => {
                  setSelectedVariant(
                    product.variants?.find((v) => v.sku === value) || undefined
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant.sku} value={variant.sku}>
                      {variant.options.map((opt) => opt.value).join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            className="w-full max-w-xs"
            disabled={product.stock === 0 || (product.variants.length > 0 && !selectedVariant)}
            onClick={handleAddToCart}
          >
            {product.variants.length > 0 && !selectedVariant
              ? "Please Select Size"
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div >
  );
};