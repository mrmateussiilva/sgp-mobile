import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  AlertCircle,
  Phone,
  DollarSign,
  Package,
  FileText,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from 'lucide-react'
import { Order } from '../hooks/useOrders'
import { StatusBadge } from './StatusBadge'
import { formatDatePtBR, parseApiDate } from '../utils/date'

interface OrderCardProps {
  order: Order
  variant?: 'compact' | 'detailed'
}

const OrderItemAccordion = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="bg-accent/30 rounded-md text-xs border border-border/50 overflow-hidden"
      onClick={(e) => {
        e.stopPropagation()
        setIsOpen(!isOpen)
      }}
    >
      <div className="p-2 flex gap-2 items-center cursor-pointer hover:bg-accent/50 transition-colors">
        <div className="flex-shrink-0">
          {item.imagem_url ? (
            <img
              src={item.imagem_url}
              alt="Item"
              className="w-8 h-8 object-cover rounded bg-background"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
                ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-8 h-8 bg-background rounded flex items-center justify-center border border-border ${item.imagem_url ? 'hidden' : ''}`}>
            <Package className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground leading-tight truncate">{item.descricao || 'Item sem descrição'}</p>
          {!isOpen && item.especificacoes && <p className="text-[10px] text-muted-foreground truncate">{item.especificacoes}</p>}
        </div>

        {isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
      </div>

      {isOpen && (
        <div className="px-2 pb-2 pl-[42px] space-y-1 animate-in slide-in-from-top-1 duration-200">
          {item.especificacoes && (
            <div className="text-muted-foreground">
              <span className="font-semibold text-[10px] uppercase">Especificações:</span>
              <p className="leading-tight">{item.especificacoes}</p>
            </div>
          )}

          {item.observacoes && (
            <div className="text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 p-1 rounded mt-1">
              <span className="font-semibold text-[10px] uppercase flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Obs:
              </span>
              <p className="leading-tight italic">{item.observacoes}</p>
            </div>
          )}

          {item.imagem_url && (
            <div className="mt-2">
              <img src={item.imagem_url} className="w-full h-auto rounded border border-border" alt="Detalhe" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const OrderCard = ({ order, variant = 'detailed' }: OrderCardProps) => {
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState<boolean>(false)

  const toggleItems = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedItems(!expandedItems)
  }

  const formatDate = (dateString: string | null | undefined) => {
    return formatDatePtBR(
      dateString,
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
      'Não definida',
    )
  }

  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return 'R$ 0,00'
    const cleanValue = value.toString().replace('R$', '').trim()
    const num = parseFloat(cleanValue)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num)
  }

  const getIsOverdue = () => {
    if (!order.data_entrega) return false
    const deliveryDate = parseApiDate(order.data_entrega)
    if (!deliveryDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deliveryDate < today && order.status !== 'entregue' && order.status !== 'cancelado'
  }

  const displayId = order.numero || `#${order.id}`
  const orderItems = order.items || order.itens || []
  const itemCount = orderItems.length
  const hasNotes = !!order.observacoes

  const sectors = [
    { key: 'setor_financeiro', label: 'FIN' },
    { key: 'setor_conferencia', label: 'CONF' },
    { key: 'setor_sublimacao', label: 'SUB' },
    { key: 'setor_costura', label: 'COS' },
    { key: 'setor_expedicao', label: 'EXP' },
  ] as const

  const overdue = getIsOverdue()
  const completedSectors = sectors.filter((sector) => !!order[sector.key as keyof Order]).length
  const progressPercent = Math.round((completedSectors / sectors.length) * 100)
  const previewItems = orderItems.slice(0, 2)
  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <div
        onClick={() => navigate(`/orders/${order.id}`)}
        className="bg-card rounded-2xl shadow-elevation p-4 cursor-pointer active:scale-[0.98] transition-all border border-border hover:border-primary/40 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">PEDIDO {displayId}</h3>
                {hasNotes && <FileText className="w-3.5 h-3.5 text-yellow-500" />}
                {overdue && (
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                    Atrasado
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase truncate mt-1">{order.cliente}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-accent/40 p-2">
              <p className="text-[9px] uppercase text-muted-foreground font-semibold">Entrega</p>
              <p className={`font-bold truncate ${overdue ? 'text-destructive' : 'text-foreground'}`}>{formatDate(order.data_entrega)}</p>
            </div>
            <div className="rounded-xl bg-accent/40 p-2">
              <p className="text-[9px] uppercase text-muted-foreground font-semibold">Total</p>
              <p className="font-bold truncate">{formatCurrency(order.valor_total)}</p>
            </div>
            <div className="rounded-xl bg-accent/40 p-2">
              <p className="text-[9px] uppercase text-muted-foreground font-semibold">Itens</p>
              <p className="font-bold truncate">{itemCount}</p>
            </div>
          </div>

          {(order.cidade_cliente || order.estado_cliente) && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase truncate">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="truncate">
                {order.cidade_cliente || ''} {order.estado_cliente ? `- ${order.estado_cliente}` : ''}
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Produção</p>
              <p className="text-[10px] font-black text-foreground">{completedSectors}/5</p>
            </div>
            <div className="h-1.5 rounded-full bg-accent/70 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Abrir detalhes</span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="bg-card rounded-2xl shadow-elevation p-4 cursor-pointer active:scale-[0.98] transition-all border border-border hover:border-primary/40 hover:shadow-elevation-md relative overflow-hidden flex flex-col gap-3"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-extrabold text-foreground tracking-tight leading-none">PEDIDO {displayId}</h3>
            {hasNotes && <FileText className="w-3.5 h-3.5 text-yellow-500" />}
            {overdue && (
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
                Atrasado
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-muted-foreground mt-1 truncate uppercase">{order.cliente}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 relative z-10">
        <div className="flex items-start space-x-2 bg-accent/30 rounded-xl p-2">
          <Calendar className={`w-3.5 h-3.5 mt-0.5 ${overdue ? 'text-destructive' : 'text-primary'}`} />
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-muted-foreground block uppercase font-semibold">Entrega</label>
            <p className={`text-xs font-bold leading-tight truncate ${overdue ? 'text-destructive' : 'text-foreground'}`}>{formatDate(order.data_entrega)}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2 bg-accent/30 rounded-xl p-2">
          <DollarSign className="w-3.5 h-3.5 mt-0.5 text-green-600" />
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-muted-foreground block uppercase font-semibold">Total</label>
            <p className="text-xs font-bold leading-tight text-foreground truncate">{formatCurrency(order.valor_total)}</p>
          </div>
        </div>

        {(order.cidade_cliente || order.estado_cliente) && (
          <div className="flex items-start space-x-2 bg-accent/30 rounded-xl p-2">
            <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" />
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-muted-foreground block uppercase font-semibold">Local</label>
              <p className="text-xs font-bold leading-tight text-foreground truncate uppercase">
                {order.cidade_cliente || ''} {order.estado_cliente ? `- ${order.estado_cliente}` : ''}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-2 bg-accent/30 rounded-xl p-2">
          <Package className="w-3.5 h-3.5 mt-0.5 text-blue-500" />
          <div className="flex-1 min-w-0">
            <label className="text-[10px] text-muted-foreground block uppercase font-semibold">Itens</label>
            <p className="text-xs font-bold leading-tight text-foreground truncate">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>

        {order.telefone_cliente && (
          <div className="flex items-start space-x-2 col-span-2 bg-accent/30 rounded-xl p-2">
            <Phone className="w-3.5 h-3.5 mt-0.5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-muted-foreground block uppercase font-semibold">Contato</label>
              <p className="text-xs font-medium leading-tight text-foreground truncate">{order.telefone_cliente}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border/50 relative z-10">
        <div onClick={toggleItems} className="flex justify-between items-center cursor-pointer py-1 px-2 hover:bg-accent/40 rounded-lg transition-colors">
          <label className="text-[10px] text-muted-foreground block uppercase font-semibold cursor-pointer">Itens do Pedido</label>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-foreground bg-accent px-2 py-0.5 rounded-full">{itemCount}</span>
            {expandedItems ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {expandedItems && (
          <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {itemCount > 0 ? (
              orderItems.map((item, index) => <OrderItemAccordion key={item.id || index} item={item} />)
            ) : (
              <p className="text-xs text-muted-foreground italic px-1">0 itens encontrado no pedido</p>
            )}
          </div>
        )}

        {!expandedItems && itemCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 px-1">
            {previewItems.map((item, index) => (
              <span key={item.id || index} className="text-[10px] font-semibold text-foreground/80 bg-accent/60 border border-border/60 rounded-full px-2 py-0.5 max-w-full truncate">
                {item.descricao || `Item ${index + 1}`}
              </span>
            ))}
            {itemCount > previewItems.length && (
              <span className="text-[10px] font-semibold text-muted-foreground bg-accent/40 rounded-full px-2 py-0.5">+{itemCount - previewItems.length} itens</span>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border/50 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Setores</p>
          <p className="text-[10px] font-black text-foreground">
            {completedSectors}/{sectors.length} concluídos
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-accent/70 overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="flex justify-between items-center gap-1">
          {sectors.map((sector) => {
            const isDone = !!order[sector.key as keyof Order]
            return (
              <div key={sector.key} className="flex flex-col items-center gap-0.5">
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />}
                <span className={`text-[9px] font-bold ${isDone ? 'text-green-700' : 'text-muted-foreground/50'}`}>{sector.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-border/50 relative z-10 flex items-center justify-between">
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Abrir detalhes</span>
        <ChevronRight className="w-4 h-4 text-primary" />
      </div>

      {overdue && (
        <div className="absolute top-0 right-0 p-1">
          <AlertCircle className="w-3 h-3 text-destructive" />
        </div>
      )}
    </div>
  )
}
