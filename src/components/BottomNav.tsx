import { useNavigate, useLocation } from 'react-router-dom'

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-20 px-2">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${
            isActive('/dashboard') 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-lg mb-1 ${isActive('/dashboard') ? 'bg-blue-100' : ''}`}>
            <svg
              className="w-7 h-7"
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
          </div>
          <span className={`text-xs font-semibold ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500'}`}>
            Início
          </span>
        </button>

        <button
          onClick={() => navigate('/orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${
            isActive('/orders') 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className={`p-2 rounded-lg mb-1 ${isActive('/orders') ? 'bg-blue-100' : ''}`}>
            <svg
              className="w-7 h-7"
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
          </div>
          <span className={`text-xs font-semibold ${isActive('/orders') ? 'text-blue-600' : 'text-gray-500'}`}>
            Pedidos
          </span>
        </button>
      </div>
    </nav>
  )
}

