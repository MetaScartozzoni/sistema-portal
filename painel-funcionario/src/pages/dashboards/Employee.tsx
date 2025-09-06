import DashboardCard from '../../components/DashboardCard'
import SkeletonCards from '../../components/SkeletonCards'
import { usePortalInfo } from '../../lib/usePortalInfo'
import { useFeatureFlags } from '../../lib/useFeatureFlags'

export default function Employee() {
  const { info, loading } = usePortalInfo()
  const { flags, loading: loadingFlags } = useFeatureFlags()
  if (loading || !info || loadingFlags) return <SkeletonCards />
  const m = info.modules
  const allow = (k: string) => (m?.[k as keyof typeof m] !== false) && (flags[`module.${k}`] !== false)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Funcionário</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="Agenda" to="/schedule" description="Agendamentos e confirmações" disabled={!allow('agenda')} />
        <DashboardCard title="Mensagens" to="/messages" description="Atendimento ao paciente" />
        <DashboardCard title="Check-in" to="/check-in" description="Chegada e triagem" disabled={!allow('agenda')} />
        <DashboardCard title="Lista de Espera" to="/waitlist" description="Otimizar horários" disabled={!allow('agenda')} />
      </div>
    </div>
  )
}

