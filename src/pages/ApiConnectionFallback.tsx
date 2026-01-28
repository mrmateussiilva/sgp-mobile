import { useState } from 'react'
import { useApiConnection } from '../hooks/useApiConnection'
import { getApiBaseUrl, FALLBACK_URLS } from '../api/client'

export const ApiConnectionFallback = () => {
  const { isOnline, isChecking, checkConnection } = useApiConnection()
  const [customUrl, setCustomUrl] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const getCurrentApiUrl = () => {
    return getApiBaseUrl()
  }

  const testConnection = async (url: string) => {
    setTesting(true)
    setTestResult(null)

    try {
      // Testa a conexão
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      await fetch(`${url}/auth/login`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Qualquer resposta HTTP significa que API está online
      setTestResult({ success: true, message: 'Conexão com API estabelecida!' })
      setTimeout(() => {
        localStorage.setItem('api_url', url)
        window.dispatchEvent(new CustomEvent('api-url-changed'))
      }, 1500)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setTestResult({
          success: false,
          message: 'Timeout: O servidor demorou muito para responder. Verifique a URL e se o servidor está acessível.'
        })
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error instanceof TypeError) {
        setTestResult({
          success: false,
          message: 'Erro de Conexão ou CORS: O navegador bloqueou a requisição. Certifique-se que o backend permite acesso (CORS) de "http://localhost:3000".'
        })
      } else {
        // Erro HTTP (4xx, 5xx) significa que o servidor respondeu, logo a conexão existe
        setTestResult({ success: true, message: 'Conexão detectada (Servidor respondeu)!' })
        setTimeout(() => {
          localStorage.setItem('api_url', url)
          window.dispatchEvent(new CustomEvent('api-url-changed'))
        }, 1500)
      }
    } finally {
      setTesting(false)
    }
  }

  const handleTestConnection = () => {
    if (!customUrl.trim()) {
      setTestResult({ success: false, message: 'Por favor, informe uma URL' })
      return
    }

    // Normaliza a URL
    let url = customUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`
    }
    url = url.replace(/\/$/, '')

    testConnection(url)
  }

  const handleRetry = () => {
    checkConnection()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-elevation-xl p-8 border border-border">
          {/* Ícone */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
              <svg
                className="w-10 h-10 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sem Conexão com a API
            </h1>
            <p className="text-sm text-muted-foreground">
              Não foi possível conectar ao servidor backend
            </p>
          </div>

          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg border border-border">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">URL Atual</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                  {getCurrentApiUrl()}
                </p>
              </div>
              <div className="flex items-center ml-3">
                {isChecking ? (
                  <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isOnline === false ? (
                  <span className="text-destructive text-sm font-semibold whitespace-nowrap">Offline</span>
                ) : (
                  <span className="text-green-600 text-sm font-semibold whitespace-nowrap">Online</span>
                )}
              </div>
            </div>
          </div>

          {/* Seleção Rápida */}
          <div className="mb-6 pt-6 border-t border-border">
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-7 0V4" />
              </svg>
              Servidores Pré-configurados
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  setCustomUrl(FALLBACK_URLS.PUBLIC)
                  testConnection(FALLBACK_URLS.PUBLIC)
                }}
                disabled={testing}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border border-border hover:border-primary/50 transition-all active:scale-[0.98]"
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Servidor Público (VPS)</p>
                  <p className="text-[10px] text-muted-foreground truncate">{FALLBACK_URLS.PUBLIC}</p>
                </div>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  setCustomUrl(FALLBACK_URLS.LOCAL)
                  testConnection(FALLBACK_URLS.LOCAL)
                }}
                disabled={testing}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-xl border border-border hover:border-primary/50 transition-all active:scale-[0.98]"
              >
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Servidor Local (Intranet)</p>
                  <p className="text-[10px] text-muted-foreground truncate">{FALLBACK_URLS.LOCAL}</p>
                </div>
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Formulário para configurar URL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Informar outra URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Ex: http://192.168.1.10"
                className="flex-1 px-4 py-3 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
                onKeyPress={(e) => e.key === 'Enter' && handleTestConnection()}
              />
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {testing ? '...' : 'Testar'}
              </button>
            </div>
            {testResult && (
              <div className={`mt-3 p-3 rounded-lg border ${testResult.success
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                <p className="text-sm font-medium">{testResult.message}</p>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              disabled={isChecking}
              className="w-full px-4 py-3 bg-accent text-foreground rounded-lg font-semibold hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-border"
            >
              {isChecking ? 'Verificando...' : 'Tentar Novamente'}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('api_url')
                window.dispatchEvent(new CustomEvent('api-url-changed'))
              }}
              className="w-full px-4 py-3 text-muted-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Usar URL Padrão
            </button>
          </div>

          {/* Informações */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Certifique-se de que o servidor backend está rodando e acessível
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

