import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'

interface LoginCredentials {
  username: string
  password: string
}

interface AuthResponse {
  token: string
  user?: {
    id: string
    email: string
    name: string
  }
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await apiClient.post<any>(
        '/auth/login',
        credentials,
        { skipAuth: true }
      )

      // Tenta diferentes formatos de resposta da API
      const token = 
        response.session_token ||
        response.token || 
        response.access_token || 
        response.accessToken ||
        response.data?.token ||
        response.data?.access_token ||
        response.data?.session_token ||
        (typeof response === 'string' ? response : null)
      
      if (token) {
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        // Dispara evento customizado para notificar mudança de autenticação
        window.dispatchEvent(new Event('auth-change'))
        // Força navegação mesmo se o PrivateRoute ainda não atualizou
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 100)
      } else {
        // Log para debug - remover em produção
        console.error('Resposta da API:', response)
        throw new Error('Token não encontrado na resposta da API. Verifique o formato da resposta.')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = (): void => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}

