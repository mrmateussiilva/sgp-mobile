import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOrders, OrderStatus } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'

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
        const deliveryDate = new Date(order.data_entrega)
        return deliveryDate < today &&
          order.status !== 'entregue' &&
          order.status !== 'cancelado'
      })
    } else if (statusFilter === 'today') {
      const todayStr = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(order => {
        if (!order.data_entrega) return false
        return order.data_entrega.startsWith(todayStr) &&
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
      const dateA = a.data_entrega ? new Date(a.data_entrega).getTime() : 0
      const dateB = b.data_entrega ? new Date(b.data_entrega).getTime() : 0
      return dateB - dateA
    })
  }, [orders, statusFilter, searchTerm])

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">Pedidos</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Gerencie todos os pedidos</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors active:bg-accent"
              title="Atualizar lista"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
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
        </div>
      </header>

      <main className="px-4 py-5 max-w-7xl mx-auto">
        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, número ou ID..."
              className="w-full pl-10 pr-4 py-3 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-background text-foreground"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'today', 'pendente', 'em_producao', 'pronto', 'overdue', 'entregue'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => handleSetStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${statusFilter === status
                  ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                  : 'bg-card text-foreground border border-border hover:border-primary/50 hover:bg-accent'
                  }`}
              >
                {status === 'all' ? '📋 Todos' :
                  status === 'today' ? '📅 Hoje' :
                    status === 'pendente' ? '⏳ Pendentes' :
                      status === 'overdue' ? '⚠️ Atrasados' :
                        status === 'em_producao' ? '🔧 Em Produção' :
                          status === 'pronto' ? '✅ Pronto' :
                            '📦 Entregues'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-3"></div>
            <p className="text-sm text-muted-foreground">Carregando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg shadow-elevation border border-border">
            <svg className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-foreground mb-1">Nenhum pedido encontrado</p>
            <p className="text-xs text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Não há pedidos cadastrados ainda'}
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-primary">
                📊 {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
              </p>
            </div>
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

