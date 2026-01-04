import { useNavigate } from 'react-router-dom'
import { Order } from '../hooks/useOrders'
import { StatusBadge } from './StatusBadge'

interface OrderCardProps {
  order: Order
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate()

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Não definida'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const isOverdue = () => {
    if (!order.data_entrega) return false
    const deliveryDate = new Date(order.data_entrega)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deliveryDate < today && order.status !== 'entregue' && order.status !== 'cancelado'
  }

  const displayId = order.numero || `#${order.id}`

  return (
    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="bg-card rounded-lg shadow-elevation p-4 cursor-pointer active:scale-[0.99] transition-all border border-border hover:shadow-elevation-md hover:border-primary/50"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground truncate">Pedido {displayId}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{order.cliente}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-border">
        <div className="flex items-center text-sm">
          <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${isOverdue() ? 'text-destructive' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Entrega</p>
            <p className={`text-sm font-semibold truncate ${isOverdue() ? 'text-destructive' : 'text-foreground'}`}>
              {formatDate(order.data_entrega)}
            </p>
          </div>
          {isOverdue() && (
            <span className="ml-2 text-xs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded flex-shrink-0">
              ⚠️
            </span>
          )}
        </div>
        {order.cidade_cliente && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Cidade</p>
              <p className="text-sm font-medium text-foreground truncate">{order.cidade_cliente}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

