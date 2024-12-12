import AdminLayout from "@/components/admin/layouts/AdminLayout";
import '../globals.css'
import { CommercifyProvider } from "@/context/CommercifyContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <CommercifyProvider>
                    <AdminLayout>{children}</AdminLayout>
                </CommercifyProvider>
            </body>
        </html>
    );
}