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
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react'

// Componente Accordion para Itens do Pedido - Visual Ficha Técnica
const OrderItemDetailAccordion = ({ item, isLast }: { item: any, isLast: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Filtra propriedades dinâmicas para exibição
  const dynamicProps = Object.entries(item).filter(([key, value]) => {
    // Lista de chaves ignoradas (campos padrão ou técnicos)
    const ignoredKeys = ['id', 'descricao', 'especificacoes', 'observacoes', 'imagem_url', 'pedido_id'];
    
    if (ignoredKeys.includes(key)) return false;

    // Verificações de valor inválido/vazio
    if (value === null || value === undefined) return false;
    if (value === '') return false;
    if (value === false) return false; // Booleano false
    if (String(value).toLowerCase() === 'false') return false; // String "false"
    if (Array.isArray(value) && value.length === 0) return false; // Array vazio
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false; // Objeto vazio

    return true;
  })

  return (
    <div className={`group transition-all duration-300 ${!isLast ? 'border-b border-border/40' : ''}`}>
      {/* Cabeçalho do Item (Sempre visível) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="py-4 flex items-start gap-4 cursor-pointer active:opacity-70"
      >
        {/* Thumb */}
        <div className="w-14 h-14 bg-accent/30 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/50 group-hover:border-primary/40 transition-colors shadow-sm">
          {item.imagem_url ? (
            <img 
              src={item.imagem_url} 
              alt="Item" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
          )}
        </div>
        
        {/* Info Resumida */}
        <div className="flex-1 min-w-0 flex flex-col justify-center min-h-[3.5rem]">
          <div className="flex justify-between items-start gap-2">
             <h4 className="text-sm font-bold text-foreground leading-snug uppercase line-clamp-2">
               {item.descricao || 'Item sem descrição'}
             </h4>
             <div className={`transition-transform duration-300 flex-shrink-0 mt-0.5 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}>
                <ChevronDown className="w-4 h-4" />
             </div>
          </div>
          
          {!isOpen && (
            <div className="flex flex-wrap gap-2 mt-1">
              {item.especificacoes && (
                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">
                  {item.especificacoes}
                </span>
              )}
              {item.observacoes && (
                <span className="text-[9px] font-black text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                   ! OBS
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Expandido (Detalhes) */}
      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0 space-y-5 px-1">
          
          {/* Seção 1: Especificações e Obs em destaque */}
          {(item.especificacoes || item.observacoes) && ( // Renderiza apenas se tiver especificações ou observações
            <div className="space-y-3">
              {item.especificacoes && ( // Renderiza especificações apenas se tiver valor
                <div className="bg-accent/10 rounded-lg p-3 border border-border/30">
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium whitespace-pre-line">
                    {item.especificacoes}
                  </p>
                </div>
              )}
              
              {item.observacoes && ( // Renderiza observações apenas se tiver valor
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 p-3 rounded-lg flex gap-3">
                  <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-bold text-yellow-800 dark:text-yellow-600 leading-snug">
                    {item.observacoes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Seção 2: Grid de Atributos Dinâmicos */}
          {dynamicProps.length > 0 && ( // Renderiza apenas se houver propriedades dinâmicas
            <div>
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 block flex items-center gap-1">
                <Tag className="w-3 h-3" /> Detalhes Técnicos
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dynamicProps.map(([key, value]) => {
                  const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
                  
                  // Verifica se é um objeto (e não array) para renderizar lista
                  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);
                  const isArray = Array.isArray(value);

                  return (
                    <div 
                      key={key} 
                      className={`bg-card border border-border/60 rounded-lg p-2.5 flex flex-col ${isObject || isArray ? 'col-span-2' : ''}`}
                    >
                      <span className="text-[9px] uppercase font-bold text-muted-foreground mb-1 truncate">{label}</span>
                      
                      {isObject ? (
                        <div className="bg-accent/10 rounded p-2 mt-1">
                          <ul className="space-y-1.5">
                            {Object.entries(value).map(([subKey, subValue]) => {
                               // Ignora valores nulos/vazios dentro do objeto
                               if (subValue === null || subValue === '' || subValue === false) return null;
                               return (
                                <li key={subKey} className="flex items-start justify-between gap-3 text-xs border-b border-border/30 last:border-0 pb-1 last:pb-0">
                                  <span className="text-muted-foreground uppercase text-[10px] font-semibold">{subKey.replace(/_/g, ' ')}</span>
                                  <span className="font-bold text-foreground text-right">{String(subValue)}</span>
                                </li>
                               )
                            })}
                          </ul>
                        </div>
                      ) : isArray ? (
                         <div className="flex flex-wrap gap-1.5">
                            {value.map((v: any, i: number) => (
                              <span key={i} className="text-[10px] font-bold bg-accent/50 px-2 py-1 rounded text-foreground">{String(v)}</span>
                            ))}
                         </div>
                      ) : (
                        <span className="text-xs font-bold text-foreground truncate" title={String(value)}>{String(value)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seção 3: Imagem Ampliada */}
          {item.imagem_url && ( // Renderiza apenas se houver imagem
            <div>
              <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 block">Referência</label>
              <div className="rounded-lg overflow-hidden border border-border/50 bg-accent/5">
                <img src={item.imagem_url} alt="Detalhe ampliado" className="w-full h-auto max-h-[300px] object-contain mx-auto" />
              </div>
            </div>
          )}
          
          {/* Mensagem de fallback se nenhuma das seções acima for renderizada */}
          {!(item.especificacoes || item.observacoes || dynamicProps.length > 0 || item.imagem_url) && (
            <p className="text-muted-foreground text-xs italic text-center py-4">Nenhum detalhe adicional disponível para este item.</p>
          )}
        </div>
      </div>
    </div>
  )
}

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
  const orderItems = order.items || order.itens || []

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card sticky top-0 z-40 border-b border-border shadow-sm">
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

      <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-bold uppercase">{message.text}</span>
          </div>
        )}

        {/* Card Principal - Resumo */}
        <section className="bg-card rounded-3xl shadow-sm border border-border p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <Package className="w-32 h-32" />
          </div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Cliente</label>
              <h2 className="text-2xl font-black text-foreground uppercase truncate leading-none tracking-tight">{order.cliente}</h2>
            </div>
            <div className="ml-4 flex-shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border/50 relative z-10">
            <div className="flex items-center space-x-3 bg-accent/20 p-3 rounded-2xl">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Calendar className={`w-5 h-5 ${isOverdue() ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Entrega</label>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-black uppercase ${isOverdue() ? 'text-destructive' : 'text-foreground'}`}>
                    {formatDate(order.data_entrega)}
                  </p>
                  {isOverdue() && (
                    <span className="text-[9px] font-black bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-md">
                      ATRASADO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {order.cidade_cliente && (
              <div className="flex items-center space-x-3 bg-accent/20 p-3 rounded-2xl">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Local</label>
                  <p className="text-sm font-black uppercase text-foreground truncate">{order.cidade_cliente}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Itens do Pedido */}
        <section className="space-y-4">
           <div className="flex items-center gap-3 px-1">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
               <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Itens do Pedido</h3>
              <p className="text-[10px] text-muted-foreground font-bold">{orderItems.length} {orderItems.length === 1 ? 'Item listado' : 'Itens listados'}</p>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-sm border border-border px-6 py-2">
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <OrderItemDetailAccordion 
                  key={item.id || index} 
                  item={item} 
                  isLast={index === orderItems.length - 1}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase text-muted-foreground">Nenhum item detalhado</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Observações Gerais */}
        {order.observacoes && (
          <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
               <MessageSquare className="w-4 h-4 text-yellow-600" />
               <h3 className="text-xs font-black uppercase tracking-widest text-yellow-800">Notas Gerais</h3>
            </div>
            <p className="text-sm font-medium text-yellow-900/80 leading-relaxed italic">"{order.observacoes}"</p>
          </section>
        )}

        {/* Status de Produção (Simplificado) */}
        {(order.setor_financeiro || order.setor_conferencia || order.setor_sublimacao || order.setor_costura || order.setor_expedicao) && (
          <section className="pt-4 border-t border-dashed border-border/50">
             <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: 'setor_financeiro', label: 'FINANCEIRO' },
                { key: 'setor_conferencia', label: 'CONFERÊNCIA' },
                { key: 'setor_sublimacao', label: 'SUBLIMAÇÃO' },
                { key: 'setor_costura', label: 'COSTURA' },
                { key: 'setor_expedicao', label: 'EXPEDIÇÃO' },
              ].map((sector) => {
                const isOk = (order as any)[sector.key]
                if (!isOk) return null
                return (
                  <div key={sector.key} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-700 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase">{sector.label}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
