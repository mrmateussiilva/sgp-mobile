import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Orders } from './pages/Orders'
import { OrderDetails } from './pages/OrderDetails'
import { ApiConnectionFallback } from './pages/ApiConnectionFallback'
import { useApiConnection } from './hooks/useApiConnection'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }

    // Verifica imediatamente
    checkAuth()

    // Escuta mudanças no localStorage (outras abas)
    const handleStorageChange = () => {
      checkAuth()
    }

    // Escuta evento customizado de mudança de autenticação (mesma aba)
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth-change', handleAuthChange)

    // Polling para detectar mudanças no mesmo tab (fallback)
    const interval = setInterval(checkAuth, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-change', handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const AppContent = () => {
  const location = useLocation()
  const { isOnline } = useApiConnection()

  // Mostra fallback apenas se:
  // 1. Está offline (isOnline === false)
  // 2. Não está na tela de login (permite tentar fazer login mesmo offline inicialmente)
  const shouldShowFallback = isOnline === false && location.pathname !== '/login'

  if (shouldShowFallback) {
    return <ApiConnectionFallback />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <PrivateRoute>
            <OrderDetails />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  )
}

export default App

