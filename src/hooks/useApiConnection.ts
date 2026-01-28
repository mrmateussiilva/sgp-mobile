import { useState, useEffect, useCallback } from 'react'
import { getApiBaseUrl } from '../api/client'

export const useApiConnection = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = useCallback(async () => {
    setIsChecking(true)
    try {
      // Tenta fazer uma requisição simples para verificar a conexão
      // Usa um endpoint que provavelmente existe (login pode retornar 422, mas significa que API está online)
      const baseUrl = getApiBaseUrl()
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // Timeout de 5 segundos

      try {
        await fetch(`${baseUrl}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        // Qualquer resposta HTTP significa que API está online
        setIsOnline(true)
        return true
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        // Se retornou algum erro HTTP (não erro de rede), significa que API está online
        if (fetchError.name !== 'AbortError' && !fetchError.message?.includes('Failed to fetch') && !fetchError.message?.includes('NetworkError')) {
          setIsOnline(true)
          return true
        }
        throw fetchError
      }
    } catch (error) {
      setIsOnline(false)
      return false
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()

    // Listen for storage changes (e.g. from other tabs or same-tab localStorage updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'api_url') {
        checkConnection()
      }
    }

    // Listen for custom event when API URL is changed in the same tab
    const handleCustomEvent = () => {
      checkConnection()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('api-url-changed', handleCustomEvent)

    // Verifica a cada 30 segundos
    const interval = setInterval(checkConnection, 30000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('api-url-changed', handleCustomEvent)
      clearInterval(interval)
    }
  }, [checkConnection])

  return { isOnline, isChecking, checkConnection }
}

