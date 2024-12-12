import AdminDashboard from '@/components/admin/screens/AdminDashboard'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'


function AdminPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AdminDashboard />
        </Suspense>
    )
}

export default AdminPage