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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border shadow-elevation-lg z-50 safe-area-bottom pb-2">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${isActive('/dashboard')
            ? 'text-primary'
            : 'text-muted-foreground'
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-primary/10' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1">
            Painel
          </span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-90 ${isActive('/orders')
            ? 'text-primary'
            : 'text-muted-foreground'
            }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${isActive('/orders') ? 'bg-primary/10' : ''}`}>
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest mt-1">
            Pedidos
          </span>
        </button>
      </div>
    </nav>
  )
}

