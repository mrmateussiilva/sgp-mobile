import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, AlertCircle } from 'lucide-react'
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
      className="bg-card rounded-lg shadow-elevation p-4 cursor-pointer active:scale-[0.98] transition-all border border-border hover:border-primary/50 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold text-foreground tracking-tight">PEDIDO {displayId}</h3>
          <p className="text-sm font-medium text-muted-foreground mt-0.5 truncate uppercase">{order.cliente}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
        <div className="flex items-start space-x-2">
          <Calendar className={`w-4 h-4 mt-0.5 ${isOverdue() ? 'text-destructive' : 'text-primary'}`} />
          <div className="flex-1 min-w-0">
            <label className="block mb-0.5">Entrega</label>
            <p className={`text-xs font-bold leading-none truncate ${isOverdue() ? 'text-destructive' : 'text-foreground'}`}>
              {formatDate(order.data_entrega)}
            </p>
          </div>
        </div>

        {order.cidade_cliente && (
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 mt-0.5 text-primary" />
            <div className="flex-1 min-w-0">
              <label className="block mb-0.5">Cidade</label>
              <p className="text-xs font-bold leading-none text-foreground truncate uppercase">{order.cidade_cliente}</p>
            </div>
          </div>
        )}
      </div>

      {isOverdue() && (
        <div className="absolute top-0 right-0 p-1">
          <AlertCircle className="w-3 h-3 text-destructive" />
        </div>
      )}
    </div>
  )
}

