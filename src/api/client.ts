// Configuração do cliente API
// Em desenvolvimento, usa o endereço do servidor local configurado em FALLBACK_URLS
// Em produção, usa a URL completa configurada no build ou fallback VPS
// URLs de Fallback pré-configuradas
export const FALLBACK_URLS = {
  PUBLIC: 'https://api.vps-finderbit.com', // Exemplo de VPS
  LOCAL: 'http://192.168.1.100:8000',     // Exemplo de IP Local (Intranet)
}

export const getApiBaseUrl = () => {
  // 1. Prioridade máxima: URL customizada manualmente pelo usuário
  const customUrl = localStorage.getItem('api_url')
  if (customUrl) {
    return customUrl
  }

  // 2. Segunda prioridade: Variável de ambiente (configurada no build)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // 3. Terceira prioridade: Detecção automática de ambiente (Desenvolvimento)
  const isDev =
    import.meta.env.DEV ||
    import.meta.env.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'

  if (isDev) {
    // Retorna o endereço local direto do backend para facilitar testes e evitar confusão com prefixos de proxy
    return FALLBACK_URLS.LOCAL
  }

  // 4. Quarta prioridade: Fallback padrão (VPS)
  return FALLBACK_URLS.PUBLIC
}

// export const API_BASE_URL = getApiBaseUrl() // Removido por não ser usado localmente de forma estática

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token')
  }

  private getBaseUrl(): string {
    return getApiBaseUrl()
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

    // Constrói a URL - sempre obtém a URL atual (pode ter mudado)
    const baseUrl = this.getBaseUrl()
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const url = `${normalizedBaseUrl}${normalizedEndpoint}`

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

