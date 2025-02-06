import AdminLayout from '@/components/admin/layouts/AdminLayout'
import AdminDashboard from '@/components/admin/screens/AdminDashboard'
import Loader from '@/components/shared/Loader'
import React, { Suspense } from 'react'


function AdminPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AdminLayout>
                <AdminDashboard />
            </AdminLayout>
        </Suspense>
    )
}

export default AdminPage