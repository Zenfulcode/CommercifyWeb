// src/app/admin/products/[id]/edit/page.tsx
import { Suspense } from "react";
import { Loader } from "lucide-react";
import ProductForm from "@/components/admin/screens/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<Loader />}>
            <ProductForm productId={params.id} />
        </Suspense>
    );
}