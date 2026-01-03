const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth, ...fetchOptions } = options

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    if (!skipAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        throw new Error('Token inválido ou expirado')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro na requisição' }))
        throw new Error(error.message || `Erro ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Erro desconhecido na requisição')
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

export const apiClient = new ApiClient()

