import { OrderStatus } from '../hooks/useOrders'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pendente: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
  },
  em_producao: {
    label: 'Em Produção',
    color: 'bg-blue-100 text-blue-800',
  },
  pronto: {
    label: 'Pronto',
    color: 'bg-purple-100 text-purple-800',
  },
  entregue: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  )
}

