import DashboardCard from '../../components/DashboardCard'
import SkeletonCards from '../../components/SkeletonCards'
import { usePortalInfo } from '../../lib/usePortalInfo'
import { useFeatureFlags } from '../../lib/useFeatureFlags'

export default function Patient() {
  const { info, loading } = usePortalInfo()
  const { flags, loading: loadingFlags } = useFeatureFlags()
  if (loading || !info || loadingFlags) return <SkeletonCards />
  const m = info.modules
  const allow = (k: string) => (m?.[k as keyof typeof m] !== false) && (flags[`module.${k}`] !== false)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Meu Portal</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Minhas Consultas" to="/my-appointments" description="Agenda e histórico" />
        <DashboardCard title="Meus Orçamentos" to="/my-budgets" description="Acompanhe propostas" disabled={!allow('orcamento')} />
        <DashboardCard title="Mensagens" to="/messages" description="Comunicados da clínica" />
        <DashboardCard title="Meu Perfil" to="/profile" description="Dados pessoais" />
      </div>
    </div>
  )
}
