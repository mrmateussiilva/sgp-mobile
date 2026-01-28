import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders, Order } from '../hooks/useOrders'
import { StatusBadge } from '../components/StatusBadge'
import { BottomNav } from '../components/BottomNav'
import {
  ArrowLeft,
  Info,
  Package,
  Truck,
  DollarSign,
  Factory,
  Calendar,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle2
} from 'lucide-react'

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
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center bg-card p-8 rounded-2xl border border-border shadow-elevation w-full max-w-sm">
          <div className="bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="text-destructive w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold uppercase mb-2">Pedido não encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">O identificador informado não corresponde a nenhum registro ativo.</p>
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase text-xs tracking-widest"
          >
            Voltar para lista
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
      <header className="bg-card sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex items-center max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2.5 bg-accent/50 text-foreground hover:bg-accent rounded-xl transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-foreground tracking-tight truncate">DETALHES DO PEDIDO</h1>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded">{displayId}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Informações operacionais</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-3xl mx-auto space-y-4">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-bold uppercase">{message.text}</span>
          </div>
        )}

        <section className="bg-card rounded-2xl shadow-elevation p-6 border border-border">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 min-w-0">
              <label className="block mb-1">Cliente</label>
              <h2 className="text-xl font-black text-foreground uppercase truncate leading-none">{order.cliente}</h2>
            </div>
            <div className="ml-4 flex-shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className={`w-5 h-5 ${isOverdue() ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block mb-1">Previsão de Entrega</label>
                <div className="flex items-center gap-2">
                  <p className={`text-base font-black uppercase ${isOverdue() ? 'text-destructive' : 'text-foreground'}`}>
                    {formatDate(order.data_entrega)}
                  </p>
                  {isOverdue() && (
                    <span className="text-[10px] font-black bg-destructive/10 text-destructive px-2 py-0.5 rounded-full animate-pulse">
                      ATRASADO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {order.cidade_cliente && (
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block mb-1">Localização</label>
                  <p className="text-base font-black uppercase text-foreground truncate">{order.cidade_cliente}</p>
                </div>
              </div>
            )}

            {order.valor_total && (
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block mb-1">Valor Total</label>
                  <p className="text-xl font-black text-foreground">{formatCurrency(order.valor_total)}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Status de Produção (Visual v4) */}
        {(order.setor_financeiro || order.setor_conferencia || order.setor_sublimacao || order.setor_costura || order.setor_expedicao || order.maquina_sublimacao || order.data_impressao) && (
          <section className="bg-card rounded-2xl shadow-elevation p-6 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Factory className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Status da Operação</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {[
                { key: 'setor_financeiro', label: 'Financeiro' },
                { key: 'setor_conferencia', label: 'Conferência' },
                { key: 'setor_sublimacao', label: 'Sublimação' },
                { key: 'setor_costura', label: 'Costura' },
                { key: 'setor_expedicao', label: 'Expedição' },
              ].map((sector) => {
                const isOk = (order as any)[sector.key]
                return (
                  <div key={sector.key} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isOk ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-accent/30 border-border text-muted-foreground/50'}`}>
                    <span className="text-[10px] font-black uppercase tracking-tight">{sector.label}</span>
                    {isOk ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current opacity-30"></div>}
                  </div>
                )
              })}
            </div>

            {(order.maquina_sublimacao || order.data_impressao) && (
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                {order.maquina_sublimacao && (
                  <div>
                    <label className="block mb-1">Equipamento</label>
                    <p className="text-sm font-black uppercase text-foreground">{order.maquina_sublimacao}</p>
                  </div>
                )}
                {order.data_impressao && (
                  <div>
                    <label className="block mb-1">Data Impressão</label>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm font-black uppercase text-foreground">{formatDate(order.data_impressao)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        <section className="bg-card rounded-2xl shadow-elevation p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Composição do Pedido</h3>
          </div>

          <div className="space-y-6">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={item.id || index} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-accent/50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-border overflow-hidden">
                      {item.imagem_url ? (
                        <img src={item.imagem_url} alt={item.descricao || undefined} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black uppercase text-foreground mb-2 leading-tight">{item.descricao || 'Item sem descrição'}</p>

                      {item.especificacoes && (
                        <div className="mb-3">
                          <label className="block mb-1">Especificações</label>
                          <p className="text-xs font-medium text-foreground whitespace-pre-wrap lowercase first-letter:uppercase">{item.especificacoes}</p>
                        </div>
                      )}

                      {item.observacoes && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex gap-x-2">
                          <MessageSquare className="w-3 h-3 text-yellow-600 mt-0.5" />
                          <div>
                            <label className="block text-yellow-800 mb-1">Observação Crítica</label>
                            <p className="text-xs font-bold text-yellow-700">{item.observacoes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Truck className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase text-muted-foreground">Nenhum item detalhado</p>
              </div>
            )}

            {order.observacoes && (
              <div className="pt-6 border-t border-border mt-4">
                <label className="block mb-2">Notas Gerais do Pedido</label>
                <div className="bg-accent/30 border border-border rounded-xl p-4">
                  <p className="text-xs font-medium text-foreground leading-relaxed italic">"{order.observacoes}"</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

