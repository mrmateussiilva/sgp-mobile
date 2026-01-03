import { useState, useMemo } from 'react'
import { useOrders, Order } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'

type StatusFilter = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'overdue'

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
        const deliveryDate = new Date(order.deliveryDate)
        return deliveryDate < today && 
               order.status !== 'delivered' && 
               order.status !== 'cancelled'
      })
    } else if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Busca por nome ou ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      )
    }

    return filtered.sort((a, b) => 
      new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
    )
  }, [orders, statusFilter, searchTerm])

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Atualizar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Busca */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {(['all', 'pending', 'overdue', 'processing', 'shipped', 'delivered'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {status === 'all' ? 'Todos' :
                 status === 'pending' ? 'Pendentes' :
                 status === 'overdue' ? 'Atrasados' :
                 status === 'processing' ? 'Processando' :
                 status === 'shipped' ? 'Enviados' :
                 'Entregues'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              {filteredOrders.length} pedido(s) encontrado(s)
            </p>
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

