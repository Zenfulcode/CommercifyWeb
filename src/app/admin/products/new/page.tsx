import { Suspense } from "react";
import ProductForm from "@/components/admin/screens/ProductForm";
import Loader from "@/components/shared/Loader";
import AdminLayout from "@/components/admin/layouts/AdminLayout";

export default function CreateProductPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AdminLayout>
                <ProductForm />
            </AdminLayout>
        </Suspense>
    );
}