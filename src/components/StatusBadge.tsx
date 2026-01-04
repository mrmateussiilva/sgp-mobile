import { OrderStatus } from '../hooks/useOrders'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pendente: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '⏳',
  },
  em_producao: {
    label: 'Em Produção',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '🔧',
  },
  pronto: {
    label: 'Pronto',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '✅',
  },
  entregue: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: '📦',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: '❌',
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-bold border-2 ${config.color}`}
    >
      <span className="mr-1.5">{config.icon}</span>
      {config.label}
    </span>
  )
}

