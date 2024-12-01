"use client";

import React from 'react';
import { productApi } from '@/services/productsService';
import { Product } from '@/types/product';
import { PageInfo } from '@/types/pagination';
import ProductCard from '@/components/products/ProductCard';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts({
          page: 0,
          size: 10,
          sort: 'id,desc'
        });
        setProducts(response._embedded.productViewModels);
        setPageInfo(response.page);
      } catch (err) {

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
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
};

export default ProductsPage;