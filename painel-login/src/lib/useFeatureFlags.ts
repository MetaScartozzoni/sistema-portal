import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.functions.invoke('get-feature-flags')
      if (!error && (data as any)?.flags) setFlags((data as any).flags)
      setLoading(false)
    })()
  }, [])

  return { flags, loading }
}

