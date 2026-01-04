import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/client'

// Status conforme a documentação da API
export type OrderStatus = 'pendente' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado'

export interface Order {
  id: number
  numero?: string | null
  cliente: string
  data_entrega?: string | null
  cidade_cliente?: string | null
  status: OrderStatus
  valor_total?: string | null
  valor_frete?: string | null
  valor_itens?: string | null
  telefone_cliente?: string | null
  estado_cliente?: string | null
  items?: Array<{
    id?: number | null
    descricao?: string | null
    [key: string]: any
  }>
  data_criacao: string
  ultima_atualizacao: string
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Memoizar fetchOrders para evitar recriação a cada render
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // A API aceita query params: skip, limit, status, cliente, data_inicio, data_fim
      const data = await apiClient.get<Order[]>('/pedidos/')
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }, []) // Dependências vazias - função não depende de nada externo

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders]) // Agora pode adicionar fetchOrders nas dependências

  // Memoizar updateOrderStatus também
  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus): Promise<void> => {
    try {
      await apiClient.patch(`/pedidos/${orderId}`, { status })
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      )
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar status')
    }
  }, [])

  // Memoizar getOrderById também
  const getOrderById = useCallback(async (orderId: number): Promise<Order> => {
    try {
      const order = await apiClient.get<Order>(`/pedidos/${orderId}`)
      return order
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao carregar pedido')
    }
  }, [])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    getOrderById,
  }
}

