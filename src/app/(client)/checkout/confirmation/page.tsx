import { Suspense } from "react";
import { ConfirmationPage } from "../_components/ConfirmationPage";

export default function Page() {
    return <Suspense>
        <ConfirmationPage />
    </Suspense>;
}