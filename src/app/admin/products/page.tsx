import AdminLayout from '@/components/admin/layouts/AdminLayout'
import ProductListView from '@/components/admin/screens/products/ProductListView'
import Loader from '@/components/shared/Loader'
import React, { Suspense } from 'react'


function ProductsPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AdminLayout>
                <ProductListView />
            </AdminLayout>
        </Suspense>
    )
}

export default ProductsPage