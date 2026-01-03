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
    const pending = orders.filter(o => o.status === 'pending').length
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const overdue = orders.filter(order => {
      const deliveryDate = new Date(order.deliveryDate)
      return deliveryDate < today && 
             order.status !== 'delivered' && 
             order.status !== 'cancelled'
    }).length

    return { total, pending, overdue }
  }, [orders])

  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime())
      .slice(0, 5)
  }, [orders])

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Atrasados</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Pedidos Recentes</h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div>
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

