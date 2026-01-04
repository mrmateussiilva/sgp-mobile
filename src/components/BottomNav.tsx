import { useNavigate, useLocation } from 'react-router-dom'

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevation-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-6 h-6 mb-0.5"
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
          <span className={`text-xs font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            Início
          </span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-lg transition-colors ${
            isActive('/orders') 
              ? 'text-primary' 
              : 'text-muted-foreground'
          }`}
        >
          <svg
            className="w-6 h-6 mb-0.5"
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
          <span className={`text-xs font-medium ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground'}`}>
            Pedidos
          </span>
        </button>
      </div>
    </nav>
  )
}

