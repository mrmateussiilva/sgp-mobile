interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
  },
  processing: {
    label: 'Em Processamento',
    color: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Enviado',
    color: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
  },
  cancelled: {
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

