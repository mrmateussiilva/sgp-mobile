import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  WifiOff,
} from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'
import { getDateKey, getTodayKeyLocal, parseApiDate } from '../utils/date'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

const LoadingOrderCard = () => {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-3 w-32 rounded bg-accent" />
        <div className="h-5 w-20 rounded-full bg-accent" />
      </div>
      <div className="h-2.5 w-40 rounded bg-accent" />
      <div className="h-8 rounded-lg bg-accent" />
      <div className="space-y-1">
        <div className="h-2 w-full rounded bg-accent" />
        <div className="h-2 w-2/3 rounded bg-accent" />
      </div>
    </div>
  )
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const { orders, loading } = useOrders()
  const { logout } = useAuth()
  const { isOnline: isNetworkOnline } = useNetworkStatus()

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === 'pendente').length
    const inProduction = orders.filter((o) => o.status === 'em_producao').length

    const todayStr = getTodayKeyLocal()
    const dueToday = orders.filter((order) => {
      if (!order.data_entrega) return false
      return getDateKey(order.data_entrega) === todayStr && order.status !== 'entregue' && order.status !== 'cancelado'
    }).length

    return { total, pending, inProduction, dueToday }
  }, [orders])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = a.data_entrega ? (parseApiDate(a.data_entrega)?.getTime() ?? 0) : 0
        const dateB = b.data_entrega ? (parseApiDate(b.data_entrega)?.getTime() ?? 0) : 0
        return dateB - dateA
      })
      .slice(0, 5)
  }, [orders])

  return (
    <div className="min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom))] bg-background">
      <header className="bg-card/95 backdrop-blur sticky top-0 z-40 border-b border-border transition-all">
        <div className="px-4 py-2.5 flex justify-between items-center max-w-7xl mx-auto gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-primary w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <span className="text-primary-foreground font-black text-[10px]">S</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-foreground tracking-tight leading-none truncate">Painel</h1>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5 truncate">Operação diária</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => navigate('/orders')}
              className="h-9 px-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black tracking-wide inline-flex items-center gap-1.5 shadow-lg shadow-primary/20 active:scale-95"
              aria-label="Ver pedidos"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span className="hidden min-[360px]:inline">Ver pedidos</span>
              <span className="min-[360px]:hidden">Pedidos</span>
            </button>
            <button
              onClick={logout}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-90"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-7xl mx-auto space-y-5">
        {!isNetworkOnline && (
          <div
            className="bg-amber-500/10 border border-amber-300/40 text-amber-700 rounded-xl px-3 py-2 text-[10px] font-bold tracking-wide flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <WifiOff className="w-3.5 h-3.5" />
            Sem internet - mostrando dados salvos
          </div>
        )}

        <section className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate('/orders')}
            className="bg-card border border-border rounded-2xl px-3 py-2.5 text-left shadow-elevation active:scale-[0.98]"
            aria-label="Ver todos os pedidos"
          >
            <p className="text-lg font-black text-foreground leading-none">{stats.total}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Ativos</p>
          </button>

          <button
            onClick={() => navigate('/orders?status=pendente')}
            className="bg-card border border-border rounded-2xl px-3 py-2.5 text-left shadow-elevation active:scale-[0.98]"
            aria-label="Ver pedidos pendentes"
          >
            <p className="text-lg font-black text-foreground leading-none">{stats.pending}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Pendentes</p>
          </button>

          <button
            onClick={() => navigate('/orders?status=em_producao')}
            className="bg-card border border-border rounded-2xl px-3 py-2.5 text-left shadow-elevation active:scale-[0.98]"
            aria-label="Ver pedidos em produção"
          >
            <p className="text-lg font-black text-foreground leading-none">{stats.inProduction}</p>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Produção</p>
          </button>
        </section>

        <section className="bg-card border border-border rounded-2xl p-3 shadow-elevation">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Fluxo de trabalho</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/orders?status=pendente')}
              className="text-left rounded-xl border border-border bg-accent/40 px-3 py-2.5 active:scale-[0.98]"
              aria-label="Abrir pedidos pendentes"
            >
              <div className="flex items-center justify-between gap-2">
                <Clock className="w-3.5 h-3.5 text-yellow-600" />
                <span className="text-base font-black leading-none text-foreground">{stats.pending}</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1">Pendentes</p>
            </button>

            <button
              onClick={() => navigate('/orders?status=em_producao')}
              className="text-left rounded-xl border border-border bg-accent/40 px-3 py-2.5 active:scale-[0.98]"
              aria-label="Abrir pedidos em produção"
            >
              <div className="flex items-center justify-between gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-base font-black leading-none text-foreground">{stats.inProduction}</span>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground mt-1">Em produção</p>
            </button>
          </div>

          <div className="mt-2 px-1 flex items-center justify-between">
            <p className="text-[10px] font-bold text-muted-foreground">Entregas hoje</p>
            <span className="text-xs font-black text-foreground inline-flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-green-600" />
              {stats.dueToday}
            </span>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-foreground">Atividade recente</h2>
            <button onClick={() => navigate('/orders')} className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline" aria-label="Ver todos os pedidos">
              Ver tudo
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <LoadingOrderCard />
              <LoadingOrderCard />
              <LoadingOrderCard />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border">
              <ClipboardList className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase text-foreground">Nenhum pedido recente</p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1">Acompanhe os pedidos pela listagem completa</p>
              <button
                onClick={() => navigate('/orders')}
                className="mt-4 h-9 px-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black tracking-wide inline-flex items-center gap-1.5 active:scale-95"
                aria-label="Abrir listagem de pedidos"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Ver pedidos
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} variant="compact" />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
