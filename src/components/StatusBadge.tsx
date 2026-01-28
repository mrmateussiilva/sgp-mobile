import { OrderStatus } from '../hooks/useOrders'
import {
  Clock,
  Settings,
  CheckCircle2,
  Package,
  XCircle
} from 'lucide-react'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pendente: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50',
    icon: Clock,
  },
  em_producao: {
    label: 'Em Produção',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50',
    icon: Settings,
  },
  pronto: {
    label: 'Pronto',
    color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50',
    icon: CheckCircle2,
  },
  entregue: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50',
    icon: Package,
  },
  cancelado: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50',
    icon: XCircle,
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config.color}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  )
}

