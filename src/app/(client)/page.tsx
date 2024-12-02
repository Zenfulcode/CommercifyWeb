"use client";

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  ServerCrash,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { productApi } from '@/services/productsService';
import ProductCard from '@/components/products/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setError(null);
      setIsRetrying(true);
      const response = await productApi.getProducts();
      setProducts(response._embedded.productViewModels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-card rounded-lg p-8 text-center space-y-6">
            <div className="flex justify-center">
              <ServerCrash className="h-16 w-16 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                Something went wrong
              </h3>
              <p className="text-muted-foreground">
                We&apos;re having trouble connecting to our servers. This might be due to:
              </p>
            </div>

            <div className="grid gap-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <WifiOff className="h-4 w-4" />
                <span>Your internet connection</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ServerCrash className="h-4 w-4" />
                <span>Our servers might be down</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Wifi className="h-4 w-4" />
                <span>A temporary network issue</span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={fetchProducts}
                disabled={isRetrying}
                className="min-w-[200px]"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}