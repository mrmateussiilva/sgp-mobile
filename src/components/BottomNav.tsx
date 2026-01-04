import { useNavigate, useLocation } from 'react-router-dom'

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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevation-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-1 max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center flex-1 min-w-[60px] h-full rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-5 h-5 mb-0.5"
            fill={isActive('/dashboard') ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className={`text-[10px] font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            Início
          </span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center flex-1 min-w-[60px] h-full rounded-lg transition-colors ${
            isActive('/orders') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-5 h-5 mb-0.5"
            fill={isActive('/orders') ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className={`text-[10px] font-medium ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground'}`}>
            Pedidos
          </span>
        </button>

        <button
          onClick={() => navigate('/reports')}
          className={`flex flex-col items-center justify-center flex-1 min-w-[60px] h-full rounded-lg transition-colors ${
            isActive('/reports') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-5 h-5 mb-0.5"
            fill={isActive('/reports') ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className={`text-[10px] font-medium ${isActive('/reports') ? 'text-primary' : 'text-muted-foreground'}`}>
            Relatórios
          </span>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className={`flex flex-col items-center justify-center flex-1 min-w-[60px] h-full rounded-lg transition-colors ${
            isActive('/admin') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-5 h-5 mb-0.5"
            fill={isActive('/admin') ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className={`text-[10px] font-medium ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
            Admin
          </span>
        </button>
      </div>
    </nav>
  )
}

