import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

export interface Order {
  id: string
  customerName: string
  deliveryDate: string
  city: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total?: number
  items?: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get<Order[]>('/orders')
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status })
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar status')
    }
  }

  const getOrderById = async (orderId: string): Promise<Order> => {
    try {
      const order = await apiClient.get<Order>(`/orders/${orderId}`)
      return order
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao carregar pedido')
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    getOrderById,
  }
}

