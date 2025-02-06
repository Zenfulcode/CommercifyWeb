import { AuthProvider } from '@/context/AuthContext';
import '../globals.css'
import { Toaster } from '@/components/ui/toaster';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <main className="flex-col w-full p-4">
                        {children}
                    </main>
                    {/* <CommercifyProvider>
                    <AdminLayout>{children}</AdminLayout>
                </CommercifyProvider> */}
                </AuthProvider>
            </body>
            <Toaster />
        </html>
    );
}