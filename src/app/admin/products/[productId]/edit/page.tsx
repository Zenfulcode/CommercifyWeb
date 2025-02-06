// src/app/admin/products/[id]/edit/page.tsx
import { Suspense } from "react";
import { Loader } from "lucide-react";
import ProductForm from "@/components/admin/screens/ProductForm";
import AdminLayout from "@/components/admin/layouts/AdminLayout";

export default function EditProductPage({ params }: { params: { id: string } }) {
    console.log(params);
    
    return (
        <Suspense fallback={<Loader />}>
            <AdminLayout>
                <ProductForm productId={params.id} />
            </AdminLayout>
        </Suspense>
    );
}