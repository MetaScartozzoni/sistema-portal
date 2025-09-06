import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

type Role = 'admin' | 'doctor' | 'secretary' | 'patient'
type Modules = Partial<{
  orcamento: boolean
  bot: boolean
  financeiro: boolean
  agenda: boolean
  prontuario: boolean
}>

type PortalInfo = { role: Role; modules: Modules }

export function usePortalInfo() {
  const [info, setInfo] = useState<PortalInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.functions.invoke('get-user-painel')
      if (!error && data) {
        setInfo({
          role: (data.role ?? 'patient') as Role,
          modules: data.modules ?? {},
        })
      }
      setLoading(false)
    })()
  }, [])

  return { info, loading }
}

