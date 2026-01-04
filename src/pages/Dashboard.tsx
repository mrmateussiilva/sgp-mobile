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
    <div className="min-h-screen pb-24 bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Visão geral dos pedidos</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sair"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <div className="bg-blue-100 rounded-lg p-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <div className="bg-yellow-100 rounded-lg p-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Atrasados</p>
              <div className="bg-red-100 rounded-lg p-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pedidos Recentes</h2>
          <p className="text-sm text-gray-500">Últimos pedidos atualizados</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando pedidos...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-500 mt-1">Os pedidos aparecerão aqui quando houver</p>
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

