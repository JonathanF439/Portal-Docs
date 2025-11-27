"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/src/context/AuthContext'
import { Layout } from '@/src/components/layout/Layout'
import { AdminDashboard } from '@/src/components/pages/documentos/Dashboard'
import { UserRole } from '@/src/types'
import { FaturamentoDashboard } from '@/src/components/pages/faturamento/Dashboard'

export default function AdminPage() {
  const { currentUser, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => { 
    if (isLoading) return
    
    if (!currentUser) {
      router.push('/')
    } else if (currentUser.role !== UserRole.ADMIN) {
      router.push('/supplier')
    }
  }, [currentUser, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null
  }

  return (
    <Layout>
      <FaturamentoDashboard />
    </Layout>
  )
}