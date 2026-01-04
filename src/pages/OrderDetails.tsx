import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders, Order, OrderStatus } from '../hooks/useOrders'
import { StatusBadge } from '../components/StatusBadge'
import { BottomNav } from '../components/BottomNav'

const statusOptions: OrderStatus[] = ['pendente', 'em_producao', 'pronto', 'entregue', 'cancelado']

const statusLabels: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  em_producao: 'Em Produção',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
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
        const orderId = parseInt(id, 10)
        if (isNaN(orderId)) {
          throw new Error('ID do pedido inválido')
        }
        const orderData = await getOrderById(orderId)
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

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !id) return

    try {
      setUpdating(true)
      setMessage(null)
      const orderId = parseInt(id, 10)
      if (isNaN(orderId)) {
        throw new Error('ID do pedido inválido')
      }
      await updateOrderStatus(orderId, newStatus)
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Não definida'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (value?: string | null) => {
    if (!value) return 'N/A'
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
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
    if (!order.data_entrega) return false
    const deliveryDate = new Date(order.data_entrega)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deliveryDate < today && order.status !== 'entregue' && order.status !== 'cancelado'
  }

  const displayId = order.numero || `#${order.id}`

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-5 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Detalhes do Pedido</h1>
            <p className="text-xs text-gray-500 mt-0.5">Informações completas</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {message && (
          <div
            className={`mb-5 p-4 rounded-xl flex items-start ${
              message.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
                : 'bg-red-50 border-l-4 border-red-500 text-red-800'
            }`}
          >
            <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
              {message.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 mb-5 border border-gray-200">
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 rounded-xl p-3 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pedido {displayId}</h2>
                  <p className="text-base text-gray-600 mt-1">{order.cliente}</p>
                </div>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-4 pt-5 border-t border-gray-200">
            <div className="flex items-start">
              <svg className={`w-6 h-6 mr-4 mt-1 ${isOverdue() ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Data de Entrega</p>
                <div className="flex items-center gap-2">
                  <p className={`text-base font-bold ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(order.data_entrega)}
                  </p>
                  {isOverdue() && (
                    <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      ⚠️ Atrasado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {order.cidade_cliente && (
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Cidade</p>
                  <p className="text-base font-semibold text-gray-900">{order.cidade_cliente}</p>
                </div>
              </div>
            )}

            {order.valor_total && (
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-4 mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Valor Total</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(order.valor_total)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alterar Status */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-5 border border-gray-200">
          <div className="flex items-center mb-5">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Alterar Status do Pedido</h3>
          </div>
          <p className="text-sm text-gray-600 mb-5">Toque no status desejado para atualizar:</p>
          <div className="space-y-3">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || order.status === status}
                className={`w-full text-left px-5 py-4 rounded-xl text-base font-semibold transition-all ${
                  order.status === status
                    ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <span>{statusLabels[status]}</span>
                  {order.status === status && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {updating && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center text-sm text-blue-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Atualizando...
              </div>
            </div>
          )}
        </div>

        {/* Itens do pedido (se disponível) */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-5">
              <div className="bg-purple-100 rounded-lg p-2 mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Itens do Pedido</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="flex items-start py-3 border-b border-gray-100 last:border-0">
                  <div className="bg-gray-100 rounded-lg p-2 mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">{item.descricao || 'Item sem descrição'}</p>
                  </div>
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

