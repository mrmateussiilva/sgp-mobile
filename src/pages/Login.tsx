import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Lock,
  LogIn,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react'
import { useAuth } from '../auth/useAuth'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Redireciona se já estiver autenticado
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login({ username, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3">
              <LayoutDashboard className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter mb-1 uppercase">S.G.P <span className="text-primary">V4</span></h1>
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">SISTEMA DE GESTÃO DE PEDIDOS</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-[2.5rem] shadow-2xl p-8 border border-border">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase leading-tight">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block px-1">USUÁRIO</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="IDENTIFICAÇÃO..."
                  className="w-full pl-11 pr-4 py-4 text-xs font-bold border border-input rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card text-foreground placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" title="SENHA" className="block px-1">SENHA</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="CÓDIGO SECRETO..."
                  className="w-full pl-11 pr-4 py-4 text-xs font-bold border border-input rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-card text-foreground placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  ACESSAR SISTEMA
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          © 2024 FINDERBIT TECHNOLOGY
        </p>
      </div>
    </div>
  )
}

