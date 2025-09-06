import DashboardCard from '../../components/DashboardCard'
import SkeletonCards from '../../components/SkeletonCards'
import { usePortalInfo } from '../../lib/usePortalInfo'
import { useFeatureFlags } from '../../lib/useFeatureFlags'

export default function Doctor() {
  const { info, loading } = usePortalInfo()
  const { flags, loading: loadingFlags } = useFeatureFlags()
  if (loading || !info || loadingFlags) return <SkeletonCards />
  const m = info.modules
  const allow = (k: string) => (m?.[k as keyof typeof m] !== false) && (flags[`module.${k}`] !== false)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Médico</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Agenda do Dia" to="/schedule" description="Consultas & cirurgias" disabled={!allow('agenda')} />
        <DashboardCard title="Prontuário" to="/records" description="Prontuários dos pacientes" disabled={!allow('prontuario')} />
        <DashboardCard title="Orçamentos" to="/budgets" description="Propostas e status" disabled={!allow('orcamento')} />
        <DashboardCard title="Mensagens" to="/messages" description="Contato com pacientes" />
      </div>
    </div>
  )
}
