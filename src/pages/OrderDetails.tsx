import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders, Order } from '../hooks/useOrders'
import { StatusBadge } from '../components/StatusBadge'
import { BottomNav } from '../components/BottomNav'

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendente',
  processing: 'Em Processamento',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOrderById, updateOrderStatus } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return
      try {
        setLoading(true)
        const orderData = await getOrderById(id)
        setOrder(orderData)
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erro ao carregar pedido',
        })
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id, getOrderById])

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order || !id) return

    try {
      setUpdating(true)
      setMessage(null)
      await updateOrderStatus(id, newStatus)
      setOrder({ ...order, status: newStatus })
      setMessage({ type: 'success', text: 'Status atualizado com sucesso!' })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao atualizar status',
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pedido não encontrado</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar para pedidos
          </button>
        </div>
      </div>
    )
  }

  const isOverdue = () => {
    const deliveryDate = new Date(order.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deliveryDate < today && order.status !== 'delivered' && order.status !== 'cancelled'
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Detalhes do Pedido</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pedido #{order.id}</h2>
              <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">Data de Entrega</p>
              <p className={`text-sm font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                {formatDate(order.deliveryDate)}
                {isOverdue() && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Atrasado
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Cidade</p>
              <p className="text-sm font-medium text-gray-900">{order.city}</p>
            </div>

            {order.total && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Alterar Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Alterar Status</h3>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || order.status === status}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Itens do pedido (se disponível) */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Itens</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

