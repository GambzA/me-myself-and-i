import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex h-dvh items-center justify-center bg-bg text-text-muted">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
