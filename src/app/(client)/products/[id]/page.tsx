import { productService } from "@/services/productsService";
import ProductDetails from "./_components/ProductDetails";

interface ProductPageProps {
    params: {
      id: string;
    };
  }
  
  export default async function ProductPage({ params }: ProductPageProps) {
    const product = await productService.getProductById(params.id);
    
    return <ProductDetails product={product} />;
  }