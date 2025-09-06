import { Link } from 'react-router-dom'

type Props = {
  title: string
  to: string
  description?: string
  disabled?: boolean
}

export default function DashboardCard({ title, to, description, disabled }: Props) {
  const className = [
    'rounded-2xl p-5 shadow-sm border',
    disabled ? 'opacity-40 pointer-events-none' : 'hover:shadow-md transition',
  ].join(' ')

  return (
    <Link to={to} className={className}>
      <div className="text-lg font-semibold">{title}</div>
      {description && <div className="text-sm mt-1 opacity-80">{description}</div>}
    </Link>
  )
}

