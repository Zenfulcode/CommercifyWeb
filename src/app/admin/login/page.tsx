"use client";

import { LoginForm } from "@/components/authentication/AuthForms";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<Loader/>}>
        <LoginForm redirectUrl="/admin" />
      </Suspense>
    </div>
  );
}