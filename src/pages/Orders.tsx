import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOrders, OrderStatus } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'
import { getDateKey, getTodayKeyLocal, parseApiDate } from '../utils/date'
import {
  Search,
  RefreshCw,
  LogOut,
  Filter,
  Calendar,
  Clock,
  Settings,
  CheckCircle2,
  Package,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'

type StatusFilter = 'all' | OrderStatus | 'overdue' | 'today'

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { orders, loading, fetchOrders } = useOrders()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) || 'all')

  // Sincronizar filtro com URL
  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      setStatusFilter(status as StatusFilter)
    }
  }, [searchParams])

  const handleSetStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status)
    if (status === 'all') {
      searchParams.delete('status')
    } else {
      searchParams.set('status', status)
    }
    setSearchParams(searchParams)
  }

  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Filtro por status
    if (statusFilter === 'overdue') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(order => {
        if (!order.data_entrega) return false
        const deliveryDate = parseApiDate(order.data_entrega)
        if (!deliveryDate) return false
        return deliveryDate < today &&
          order.status !== 'entregue' &&
          order.status !== 'cancelado'
      })
    } else if (statusFilter === 'today') {
      const todayStr = getTodayKeyLocal()
      filtered = filtered.filter(order => {
        if (!order.data_entrega) return false
        return getDateKey(order.data_entrega) === todayStr &&
          order.status !== 'entregue' &&
          order.status !== 'cancelado'
      })
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Busca por nome ou ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.cliente.toLowerCase().includes(term) ||
        order.numero?.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      )
    }

    return filtered.sort((a, b) => {
      const dateA = a.data_entrega ? (parseApiDate(a.data_entrega)?.getTime() ?? 0) : 0
      const dateB = b.data_entrega ? (parseApiDate(b.data_entrega)?.getTime() ?? 0) : 0
      return dateB - dateA
    })
  }, [orders, statusFilter, searchTerm])

  const statusIcons: Record<StatusFilter, any> = {
    all: Filter,
    today: Calendar,
    pendente: Clock,
    em_producao: Settings,
    pronto: CheckCircle2,
    overdue: AlertTriangle,
    entregue: Package,
    cancelado: AlertTriangle // Ou X daqui a pouco se preferir, mas para manter o tipo StatusFilter (que inclui os OrderStatus)
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card sticky top-0 z-40 border-b border-border">
        <div className="px-5 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs">S</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tighter leading-none uppercase">Pedidos</h1>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Listagem Geral</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchOrders}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-accent rounded-xl transition-all active:scale-90"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
            <button
              onClick={logout}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-90"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 max-w-7xl mx-auto space-y-6">
        {/* Busca */}
        <section>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="CLIENTE, NÚMERO OU ID..."
              className="w-full pl-11 pr-4 py-4 text-xs font-bold border border-input rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card text-foreground shadow-sm placeholder:text-muted-foreground/30"
            />
          </div>
        </section>

        {/* Filtros */}
        <section>
          <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
            {(['all', 'today', 'pendente', 'em_producao', 'pronto', 'overdue', 'entregue'] as StatusFilter[]).map((status) => {
              const Icon = statusIcons[status]
              const isActive = statusFilter === status
              return (
                <button
                  key={status}
                  onClick={() => handleSetStatusFilter(status)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-current' : 'text-primary'}`} />
                  {status === 'all' ? 'Todos' :
                    status === 'today' ? 'Hoje' :
                      status === 'pendente' ? 'Pendentes' :
                        status === 'overdue' ? 'Atrasados' :
                          status === 'em_producao' ? 'Produção' :
                            status === 'pronto' ? 'Prontos' :
                              'Entregues'}
                </button>
              )
            })}
          </div>
        </section>

        {/* Resultados */}
        <section className="space-y-4">
          {!loading && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'Pedido Correspondente' : 'Pedidos Correspondentes'}
                </p>
              </div>
              <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sincronizando Lista...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-inner">
              <div className="bg-accent/50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <p className="text-sm font-black text-foreground mb-1 uppercase tracking-tight">Sem resultados</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Tente outros termos ou remova os filtros
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} variant="detailed" />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
