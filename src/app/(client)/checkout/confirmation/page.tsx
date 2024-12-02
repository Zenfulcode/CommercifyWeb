import { Suspense } from "react";
import { ConfirmationPage } from "../_components/ConfirmationPage";
import { Loader } from "lucide-react";

export default function Page() {
    return (
        <Suspense fallback={<Loader />}>
            <ConfirmationPage />
        </Suspense>
    );
}