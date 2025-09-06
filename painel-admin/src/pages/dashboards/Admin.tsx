import DashboardCard from '../../components/DashboardCard'
import SkeletonCards from '../../components/SkeletonCards'
import { usePortalInfo } from '../../lib/usePortalInfo'
import { useFeatureFlags } from '../../lib/useFeatureFlags'

export default function Admin() {
  const { info, loading } = usePortalInfo()
  const { flags, loading: loadingFlags } = useFeatureFlags()
  if (loading || !info || loadingFlags) return <SkeletonCards />
  const m = info.modules
  const allow = (k: string) => (m?.[k as keyof typeof m] !== false) && (flags[`module.${k}`] !== false)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Orçamentos" to="/budgets" description="Gerenciar orçamentos" disabled={!allow('orcamento')} />
        <DashboardCard title="Financeiro" to="/finance" description="Contas, recebíveis" disabled={!allow('financeiro')} />
        <DashboardCard title="Bots" to="/bots" description="Canais e automações" disabled={!allow('bot')} />
        <DashboardCard title="Agenda" to="/schedule" description="Consultas e cirurgias" disabled={!allow('agenda')} />
        <DashboardCard title="Prontuário" to="/records" description="Prontuários e documentos" disabled={!allow('prontuario')} />
        <DashboardCard title="Configurações" to="/settings" description="Sistema e permissões" />
        <DashboardCard title="Auditoria" to="/audit-log" description="Eventos e trilhas" />
      </div>
    </div>
  )
}
