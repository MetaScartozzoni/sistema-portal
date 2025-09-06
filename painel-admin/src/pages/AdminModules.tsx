import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type ModuleRow = { key: string; enabled: boolean }

export default function AdminModules() {
  const [rows, setRows] = useState<ModuleRow[]>([
    { key: 'agenda', enabled: true },
    { key: 'prontuario', enabled: true },
    { key: 'orcamento', enabled: true },
    { key: 'financeiro', enabled: true },
    { key: 'bot', enabled: true },
  ])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function toggle(key: string, enabled: boolean) {
    setBusy(key)
    setError(null)
    try {
      const { error } = await supabase.functions.invoke('admin-toggle-module', {
        body: { module: key, enabled },
      })
      if (error) throw error
      setRows((rs) => rs.map((r) => (r.key === key ? { ...r, enabled } : r)))
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setBusy(null)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-system-health')
        if (!error && data?.flags) {
          const f = data.flags as Record<string, boolean>
          setRows((rs) => rs.map((r) => ({ ...r, enabled: f[`module.${r.key}`] !== false })))
        }
      } catch (_) {}
    })()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Módulos</h1>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between border rounded p-3">
            <div className="font-medium">{r.key}</div>
            <button
              disabled={busy === r.key}
              className={`px-3 py-1 rounded text-sm border ${r.enabled ? 'bg-green-50' : 'bg-gray-50'}`}
              onClick={() => toggle(r.key, !r.enabled)}
            >
              {busy === r.key ? '...' : r.enabled ? 'Desligar' : 'Ligar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
