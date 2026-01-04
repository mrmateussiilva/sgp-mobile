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
      className="bg-white rounded-xl shadow-md p-5 mb-4 cursor-pointer active:scale-[0.98] transition-all border border-gray-200 hover:shadow-lg hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Pedido {displayId}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{order.cliente}</p>
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm">
          <svg className={`w-5 h-5 mr-3 ${isOverdue() ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Data de Entrega</p>
            <p className={`text-sm font-semibold ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDate(order.data_entrega)}
            </p>
          </div>
          {isOverdue() && (
            <span className="ml-2 text-xs font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full">
              ⚠️ Atrasado
            </span>
          )}
        </div>
        {order.cidade_cliente && (
          <div className="flex items-center text-sm">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Cidade</p>
              <p className="text-sm font-semibold text-gray-900">{order.cidade_cliente}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

