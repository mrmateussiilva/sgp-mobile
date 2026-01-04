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
      className="bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer active:scale-[0.98] transition-transform border border-gray-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">Pedido {displayId}</h3>
          <p className="text-sm text-gray-600 mt-1">{order.cliente}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Entrega:</span>
          <span className={isOverdue() ? 'text-red-600 font-semibold' : ''}>
            {formatDate(order.data_entrega)}
          </span>
          {isOverdue() && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
              Atrasado
            </span>
          )}
        </div>
        {order.cidade_cliente && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Cidade:</span>
            <span>{order.cidade_cliente}</span>
          </div>
        )}
      </div>
    </div>
  )
}

