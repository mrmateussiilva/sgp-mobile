import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders, Order } from '../hooks/useOrders'
import { StatusBadge } from '../components/StatusBadge'
import { BottomNav } from '../components/BottomNav'

export const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
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
            className={`mb-4 p-3 rounded-lg flex items-start ${message.type === 'success'
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

        {/* Informações da Produção (Somente Leitura) */}
        {(order.setor_financeiro || order.setor_conferencia || order.setor_sublimacao || order.setor_costura || order.setor_expedicao || order.maquina_sublimacao || order.data_impressao) && (
          <div className="bg-card rounded-lg shadow-elevation p-5 mb-4 border border-border">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Status de Produção
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-2 rounded text-center border ${order.setor_financeiro ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                <p className="text-[10px] uppercase font-bold">Financeiro</p>
                <p className="text-xs font-semibold">{order.setor_financeiro ? 'OK' : '-'}</p>
              </div>
              <div className={`p-2 rounded text-center border ${order.setor_conferencia ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                <p className="text-[10px] uppercase font-bold">Conferência</p>
                <p className="text-xs font-semibold">{order.setor_conferencia ? 'OK' : '-'}</p>
              </div>
              <div className={`p-2 rounded text-center border ${order.setor_sublimacao ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                <p className="text-[10px] uppercase font-bold">Sublimação</p>
                <p className="text-xs font-semibold">{order.setor_sublimacao ? 'OK' : '-'}</p>
              </div>
              <div className={`p-2 rounded text-center border ${order.setor_costura ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                <p className="text-[10px] uppercase font-bold">Costura</p>
                <p className="text-xs font-semibold">{order.setor_costura ? 'OK' : '-'}</p>
              </div>
              <div className={`p-2 rounded text-center border ${order.setor_expedicao ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}>
                <p className="text-[10px] uppercase font-bold">Expedição</p>
                <p className="text-xs font-semibold">{order.setor_expedicao ? 'OK' : '-'}</p>
              </div>
            </div>

            {(order.maquina_sublimacao || order.data_impressao) && (
              <div className="pt-4 border-t border-border space-y-3">
                {order.maquina_sublimacao && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Máquina de Sublimação</p>
                    <p className="text-sm font-semibold text-foreground">{order.maquina_sublimacao}</p>
                  </div>
                )}
                {order.data_impressao && (
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Data de Impressão</p>
                    <p className="text-sm font-semibold text-foreground">{formatDate(order.data_impressao)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Itens do pedido */}
        <div className="bg-card rounded-lg shadow-elevation p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Itens do Pedido
          </h3>

          <div className="space-y-6">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={item.id || index} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    {/* Placeholder para imagem */}
                    <div className="w-20 h-20 bg-accent/50 rounded-lg flex-shrink-0 flex items-center justify-center border border-dashed border-border overflow-hidden">
                      {item.imagem_url ? (
                        <img src={item.imagem_url} alt={item.descricao || undefined} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground mb-1">{item.descricao || 'Item sem descrição'}</p>

                      {item.especificacoes && (
                        <div className="mb-2">
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Especificações</p>
                          <p className="text-xs text-foreground whitespace-pre-wrap">{item.especificacoes}</p>
                        </div>
                      )}

                      {item.observacoes && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Observações do Item</p>
                          <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mt-1 border border-yellow-100">{item.observacoes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 italic">Nenhum item detalhado encontrado</p>
            )}

            {order.observacoes && (
              <div className="pt-4 border-t border-border mt-4">
                <h4 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Observações do Pedido</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-700 whitespace-pre-wrap">{order.observacoes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

