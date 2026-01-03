import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'

interface LoginCredentials {
  email: string
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
      const response = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials,
        { skipAuth: true }
      )

      if (response.token) {
        localStorage.setItem('token', response.token)
        setIsAuthenticated(true)
        navigate('/dashboard')
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

