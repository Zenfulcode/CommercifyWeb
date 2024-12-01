import '../globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { CartSheet } from '@/components/webshop/CartSheet'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'Commercify Demo Store',
  description: 'A simple e-commerce store built on top of Commercify.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="relative">
              <header className="sticky top-0 z-50 bg-background border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                  <nav>{/* Your navigation items */}</nav>
                  <CartSheet />
                </div>
              </header>
              <main>{children}</main>
            </div>
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}