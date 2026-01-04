import { useState, useMemo } from 'react'
import { useOrders, Order, OrderStatus } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'

type StatusFilter = 'all' | OrderStatus | 'overdue'

export const Orders = () => {
  const { orders, loading, fetchOrders } = useOrders()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

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
    <div className="min-h-screen pb-24 bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie todos os pedidos</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title="Atualizar lista"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title="Sair"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Busca */}
        <div className="mb-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, número ou ID..."
              className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Filtrar por status:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'pendente', 'overdue', 'em_producao', 'pronto', 'entregue'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {status === 'all' ? '📋 Todos' :
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
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium mb-1">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Não há pedidos cadastrados ainda'}
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-blue-900">
                📊 {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
              </p>
            </div>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

