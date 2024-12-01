import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
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
import { Product, ProductVariant } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | undefined>();
  const [isSelectingVariant, setIsSelectingVariant] = React.useState(false);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on select or button
    if (
      e.target instanceof HTMLButtonElement ||
      e.target instanceof HTMLSelectElement ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('select')
    ) {
      e.stopPropagation();
      return;
    }
    router.push(`/products/${product.id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.variants.length > 0) {
      if (!selectedVariant) {
        setIsSelectingVariant(true);
        return;
      }
    }

    addToCart(product, selectedVariant);
    setIsSelectingVariant(false);
    setSelectedVariant(undefined);
  };

  return (
    <Card
      className="w-full transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="aspect-square relative w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl || placeholderImage}
            alt={product.name}
            className="object-cover object-center w-full h-full"
            width={300}
            height={300}
          />
        </div>
        <div className="mt-4">
          <CardTitle className="text-lg">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mt-2">
          {product.description || "No description available"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex justify-between items-center w-full">
          <div className="text-lg font-semibold">
            {formatPrice(product.price.amount, product.price.currency)}
          </div>
          {product.stock === 0 && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        {(product.variants.length > 0 && (isSelectingVariant || selectedVariant)) && (
          <Select
            value={selectedVariant?.sku ?? ""}
            onValueChange={(value) => {
              setSelectedVariant(
                product.variants.find((v) => v.sku === value) || undefined
              );
            }}
          >
            <SelectTrigger className="w-full">
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
        )}

        <Button
          className="w-full"
          onClick={handleAddToCartClick}
          disabled={product.stock === 0 || (product.variants.length > 0 && isSelectingVariant && !selectedVariant)}
        >
          {product.variants.length > 0 && !selectedVariant
            ? "Select Size"
            : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;