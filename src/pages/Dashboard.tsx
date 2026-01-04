import { useMemo } from 'react'
import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'

export const Dashboard = () => {
  const { orders, loading } = useOrders()
  const { logout } = useAuth()

  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter(o => o.status === 'pendente').length
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const overdue = orders.filter(order => {
      if (!order.data_entrega) return false
      const deliveryDate = new Date(order.data_entrega)
      return deliveryDate < today && 
             order.status !== 'entregue' && 
             order.status !== 'cancelado'
    }).length

    return { total, pending, overdue }
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
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Visão geral dos pedidos</p>
          </div>
          <button
            onClick={logout}
            className="p-2.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors active:bg-accent"
            title="Sair"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-5 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-elevation border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <div className="bg-primary/10 rounded-md p-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-elevation border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Pendentes</p>
              <div className="bg-yellow-50 rounded-md p-1.5">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-elevation border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Atrasados</p>
              <div className="bg-destructive/10 rounded-md p-1.5">
                <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Pedidos Recentes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Últimos pedidos atualizados</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-3"></div>
            <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg shadow-elevation border border-border">
            <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-foreground">Nenhum pedido encontrado</p>
            <p className="text-xs text-muted-foreground mt-1">Os pedidos aparecerão aqui quando houver</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

