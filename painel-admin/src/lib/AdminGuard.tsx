import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePortalInfo } from './usePortalInfo'

export function AdminGuard({ children }: { children: JSX.Element }) {
  const { info, loading } = usePortalInfo()
  const nav = useNavigate()
  useEffect(() => {
    if (loading) return
    if (info?.role !== 'admin') nav('/portal', { replace: true })
  }, [loading, info, nav])
  if (loading || info?.role !== 'admin') return null
  return children
}

