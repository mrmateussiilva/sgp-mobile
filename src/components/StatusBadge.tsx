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
  variant?: 'default' | 'contrast'
}

const statusConfig: Record<OrderStatus, { label: string; style: { backgroundColor: string; color: string; borderColor: string }; icon: any }> = {
  pendente: {
    label: 'Pendente',
    style: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      borderColor: '#FCD34D',
    },
    icon: Clock,
  },
  em_producao: {
    label: 'Em Produção',
    style: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      borderColor: '#93C5FD',
    },
    icon: Settings,
  },
  pronto: {
    label: 'Pronto',
    style: {
      backgroundColor: '#EDE9FE',
      color: '#5B21B6',
      borderColor: '#C4B5FD',
    },
    icon: CheckCircle2,
  },
  entregue: {
    label: 'Entregue',
    style: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
      borderColor: '#86EFAC',
    },
    icon: Package,
  },
  cancelado: {
    label: 'Cancelado',
    style: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
      borderColor: '#FCA5A5',
    },
    icon: XCircle,
  },
}

export const StatusBadge = ({ status, variant = 'default' }: StatusBadgeProps) => {
  const config = statusConfig[status]
  const Icon = config.icon
  const contrastClass = variant === 'contrast' ? 'shadow-sm ring-1 ring-black/5 dark:ring-white/10' : ''

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${contrastClass}`}
      style={config.style}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  )
}
