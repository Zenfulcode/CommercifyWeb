import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/screens/ProductForm";

export default function CreateProductPage() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <ProductForm />
        </Suspense>
    );
}