import { useState } from 'react'
import {
  WifiOff,
  Globe,
  Home,
  ArrowRight,
  Settings,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
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
      setTestResult({ success: true, message: 'CONEXÃO ESTABELECIDA COM SUCESSO!' })
      setTimeout(() => {
        localStorage.setItem('api_url', url)
        window.dispatchEvent(new CustomEvent('api-url-changed'))
      }, 1500)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setTestResult({
          success: false,
          message: 'TIMEOUT: O SERVIDOR NÃO RESPONDEU A TEMPO.'
        })
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error instanceof TypeError) {
        setTestResult({
          success: false,
          message: 'ERRO DE REDE: VERIFIQUE O CORS OU A DISPONIBILIDADE DO BACKEND.'
        })
      } else {
        // Erro HTTP (4xx, 5xx) significa que o servidor respondeu, logo a conexão existe
        setTestResult({ success: true, message: 'CONEXÃO DETECTADA (SERVIDOR RESPONDEU)!' })
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
      setTestResult({ success: false, message: 'POR FAVOR, INFORME UMA URL' })
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
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-[2.5rem] shadow-2xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-destructive/10 mb-6 rotate-3">
              <WifiOff className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-1 uppercase tracking-tighter">API Offline</h1>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Falha na sincronização</p>
          </div>

          {/* Status Atual */}
          <div className="mb-8 p-4 bg-accent/30 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Configuração Atual</label>
              {isChecking ? (
                <RefreshCw className="w-3 h-3 text-primary animate-spin" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${isOnline === false ? 'bg-destructive' : 'bg-green-500'}`}></div>
              )}
            </div>
            <p className="text-[11px] font-bold text-foreground font-mono truncate bg-background/50 p-2 rounded-lg border border-border/50">
              {getCurrentApiUrl()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Atalhos */}
            <section>
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-4 px-1">Redirecionar Conexão</label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setCustomUrl(FALLBACK_URLS.PUBLIC)
                    testConnection(FALLBACK_URLS.PUBLIC)
                  }}
                  disabled={testing}
                  className="group flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all active:scale-95 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">Servidor VPS</p>
                      <p className="text-[9px] text-muted-foreground font-bold tracking-tighter capitalize">Acesso Externo</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setCustomUrl(FALLBACK_URLS.LOCAL)
                    testConnection(FALLBACK_URLS.LOCAL)
                  }}
                  disabled={testing}
                  className="group flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all active:scale-95 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">Rede Local</p>
                      <p className="text-[9px] text-muted-foreground font-bold tracking-tighter capitalize">Intranet / Wi-Fi</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </button>
              </div>
            </section>

            {/* Custom URL */}
            <section>
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-4 px-1">Configuração Manual</label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="HTTP://ENDEREÇO..."
                    className="w-full pl-10 pr-4 py-4 text-[10px] font-bold border border-input rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card text-foreground placeholder:text-muted-foreground/30"
                    onKeyPress={(e) => e.key === 'Enter' && handleTestConnection()}
                  />
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 active:scale-90 transition-all"
                >
                  {testing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                </button>
              </div>
              {testResult && (
                <div className={`mt-4 p-4 rounded-2xl border flex gap-3 transition-all animate-in slide-in-from-top-2 ${testResult.success
                  ? 'bg-green-500/10 border-green-500/20 text-green-600'
                  : 'bg-destructive/10 border-destructive/20 text-destructive'
                  }`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">{testResult.message}</p>
                </div>
              )}
            </section>

            {/* Final Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              <button
                onClick={handleRetry}
                disabled={isChecking}
                className="w-full py-4 bg-accent text-foreground rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-border active:scale-95 transition-all shadow-sm"
              >
                {isChecking ? 'Sincronizando...' : 'Tentar Reconexão'}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('api_url')
                  window.dispatchEvent(new CustomEvent('api-url-changed'))
                }}
                className="w-full py-3 text-muted-foreground rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-accent transition-all"
              >
                Restaurar Padrão
              </button>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
          S.G.P MOBILE V4.0.0
        </p>
      </div>
    </div>
  )
}

