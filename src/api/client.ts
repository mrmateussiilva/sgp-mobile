// Em desenvolvimento, usa o proxy do Vite (/api)
// Em produção, usa a URL completa da API
// O proxy remove o /api e redireciona para localhost:8000
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // Em desenvolvimento, usa proxy relativo
  // Verifica múltiplas formas de detectar desenvolvimento
  const isDev = 
    import.meta.env.DEV || 
    import.meta.env.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  
  if (isDev) {
    return '/api'
  }
  // Em produção, usa URL completa
  return 'http://localhost:8000'
}

const API_BASE_URL = getApiBaseUrl()

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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }

    if (!skipAuth) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    // Garante que o endpoint comece com /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    
    // Constrói a URL - se baseUrl já termina com /, não adiciona outro
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    const url = `${baseUrl}${normalizedEndpoint}`

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
        let errorMessage = `Erro ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          // Se não conseguir parsear JSON, usa a mensagem padrão
        }
        throw new Error(errorMessage)
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

