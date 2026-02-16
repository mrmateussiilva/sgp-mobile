import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList } from 'lucide-react'

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto px-3 pb-[calc(0.4rem+env(safe-area-inset-bottom))]">
        <div className="bg-card border border-border/90 shadow-elevation-xl rounded-t-2xl rounded-b-xl">
          <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Ir para painel"
          className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${isActive('/dashboard')
            ? 'text-primary'
            : 'text-muted-foreground'
            }`}
        >
          <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full transition-all ${isActive('/dashboard') ? 'bg-primary' : 'bg-transparent'}`} />
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-primary/15' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground'}`}>
            Painel
          </span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          aria-label="Ir para pedidos"
          className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${isActive('/orders')
            ? 'text-primary'
            : 'text-muted-foreground'
            }`}
        >
          <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full transition-all ${isActive('/orders') ? 'bg-primary' : 'bg-transparent'}`} />
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/orders') ? 'bg-primary/15' : ''}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isActive('/orders') ? 'text-foreground' : 'text-muted-foreground'}`}>
            Pedidos
          </span>
        </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
