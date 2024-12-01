"use client";

import React from 'react';
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>(
    product.variants?.[0] || null
  );

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleAddToCart = () => {
    // If product has variants, only add to cart if a variant is selected
    if (product.variants.length > 0 && !selectedVariant) {
      // You might want to add a toast or error message here
      return;
    }

    addToCart(product, selectedVariant);
  };

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
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbLink href="/">Products</BreadcrumbLink>
          <BreadcrumbItem>{product.name}</BreadcrumbItem>

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
    </div>
  );
};

export default ProductDetails;