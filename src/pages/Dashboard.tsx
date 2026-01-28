import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'

export const Dashboard = () => {
  const navigate = useNavigate()
  const { orders, loading } = useOrders()
  const { logout } = useAuth()

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter(o => o.status === 'pendente').length

    const todayStr = new Date().toISOString().split('T')[0]
    const dueToday = orders.filter(order => {
      if (!order.data_entrega) return false
      return order.data_entrega.startsWith(todayStr) &&
        order.status !== 'entregue' &&
        order.status !== 'cancelado'
    }).length

    return { total, pending, dueToday }
  }, [orders])

  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => {
        const dateA = a.data_entrega ? new Date(a.data_entrega).getTime() : 0
        const dateB = b.data_entrega ? new Date(b.data_entrega).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 5)
  }, [orders])

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card sticky top-0 z-40 border-b border-border transition-all">
        <div className="px-5 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-black text-xs">S</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground tracking-tighter leading-none">S.G.P <span className="text-primary">v4</span></h1>
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">Control Center</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-90"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-5 py-6 max-w-7xl mx-auto space-y-8">
        {/* Sumário Executivo */}
        <section>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-primary rounded-3xl p-6 shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <label className="text-primary-foreground/70 mb-1 block">Pedidos Ativos</label>
                  <p className="text-4xl font-black text-white leading-none">{stats.total}</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md mb-2 inline-block">
                    <TrendingUp className="text-white w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Geral</p>
                </div>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-5 border border-border shadow-elevation">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-500/10 p-2 rounded-xl">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <label className="text-yellow-600/80">Pendentes</label>
                </div>
                <p className="text-3xl font-black text-foreground leading-none">{stats.pending}</p>
              </div>

              <div className="bg-card rounded-2xl p-5 border border-border shadow-elevation">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/10 p-2 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <label className="text-green-600/80">Entrega Hoje</label>
                </div>
                <p className="text-3xl font-black text-foreground leading-none">{stats.dueToday}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ações Rápidas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Fluxo de Trabalho</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/orders?status=pendente')}
              className="group flex flex-col items-start p-5 bg-card border border-border rounded-2xl shadow-sm active:scale-95 transition-all text-left relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-accent text-foreground flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-foreground mb-1 uppercase tracking-tight">Pendentes</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Aguardando Início</p>
              <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => navigate('/orders?status=em_producao')}
              className="group flex flex-col items-start p-5 bg-card border border-border rounded-2xl shadow-sm active:scale-95 transition-all text-left relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-accent text-foreground flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-black text-foreground mb-1 uppercase tracking-tight">Em Produção</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Em Andamento</p>
              <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </section>

        {/* Pedidos Recentes */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Atividade Recente</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
            >
              Ver Tudo
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sincronizando dados...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
              <ClipboardList className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-xs font-bold uppercase text-muted-foreground">Repositório Vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

