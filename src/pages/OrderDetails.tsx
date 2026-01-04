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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-4">Pedido não encontrado</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-primary hover:text-primary/80"
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
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex items-center max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors active:bg-accent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Detalhes do Pedido</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Informações completas</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 max-w-7xl mx-auto">
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg flex items-start ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}
          >
            <svg className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-destructive'}`} fill="currentColor" viewBox="0 0 20 20">
              {message.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span className="text-xs font-medium">{message.text}</span>
          </div>
        )}

        <div className="bg-card rounded-lg shadow-elevation p-5 mb-4 border border-border">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">Pedido {displayId}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{order.cliente}</p>
            </div>
            <div className="ml-3 flex-shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center text-sm">
              <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${isOverdue() ? 'text-destructive' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Data de Entrega</p>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold truncate ${isOverdue() ? 'text-destructive' : 'text-foreground'}`}>
                    {formatDate(order.data_entrega)}
                  </p>
                  {isOverdue() && (
                    <span className="text-xs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded flex-shrink-0">
                      ⚠️
                    </span>
                  )}
                </div>
              </div>
            </div>

            {order.cidade_cliente && (
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Cidade</p>
                  <p className="text-sm font-semibold text-foreground truncate">{order.cidade_cliente}</p>
                </div>
              </div>
            )}

            {order.valor_total && (
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                  <p className="text-base font-bold text-foreground truncate">{formatCurrency(order.valor_total)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alterar Status */}
        <div className="bg-card rounded-lg shadow-elevation p-5 mb-4 border border-border">
          <h3 className="text-base font-bold text-foreground mb-1">Alterar Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Toque no status desejado:</p>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || order.status === status}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  order.status === status
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-accent text-foreground hover:bg-accent/80 border border-border hover:border-primary/50'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:border-border`}
              >
                <div className="flex items-center justify-between">
                  <span>{statusLabels[status]}</span>
                  {order.status === status && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          {updating && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center text-xs text-primary">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
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
          <div className="bg-card rounded-lg shadow-elevation p-5 border border-border">
            <h3 className="text-base font-bold text-foreground mb-4">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="flex items-start py-2 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.descricao || 'Item sem descrição'}</p>
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

