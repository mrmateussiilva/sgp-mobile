import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'
import { apiClient } from '../api/client'
import { formatDatePtBR } from '../utils/date'

type AdminSection = 'users' | 'settings' | 'backup' | 'logs' | 'system'

interface AdminData {
  [key: string]: any
}

export const Admin = () => {
  const { logout } = useAuth()
  const [selectedSection, setSelectedSection] = useState<AdminSection | null>(null)
  const [loading, setLoading] = useState(false)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const adminSections: Array<{ section: AdminSection; label: string; icon: string; description: string }> = [
    { section: 'users', label: 'Usuários', icon: '👥', description: 'Gerenciar usuários do sistema' },
    { section: 'settings', label: 'Configurações', icon: '⚙️', description: 'Configurações gerais do sistema' },
    { section: 'backup', label: 'Backup', icon: '💾', description: 'Gerenciar backups e restaurações' },
    { section: 'logs', label: 'Logs', icon: '📝', description: 'Visualizar logs do sistema' },
    { section: 'system', label: 'Sistema', icon: '🔧', description: 'Informações do sistema' },
  ]

  const fetchAdminData = async (section: AdminSection) => {
    setLoading(true)
    setError(null)
    setAdminData(null)

    try {
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        `/admin/${section}`,
        `/admin/${section}/`,
        `/administracao/${section}`,
        `/management/${section}`,
      ]

      let data: AdminData | null = null
      let lastError: Error | null = null

      for (const endpoint of endpoints) {
        try {
          data = await apiClient.get<AdminData>(endpoint)
          break
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Erro desconhecido')
          continue
        }
      }

      if (!data) {
        throw lastError || new Error('Nenhum endpoint de admin encontrado')
      }

      setAdminData(data)
      setSelectedSection(section)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados administrativos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    return formatDatePtBR(dateString, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">Administração</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Gerenciamento do sistema</p>
          </div>
          <button
            onClick={logout}
            className="p-2.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors active:bg-accent"
            title="Sair"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="px-4 py-5 max-w-7xl mx-auto">
        {/* Lista de Seções Administrativas */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground mb-3">Áreas Administrativas</h2>
          <div className="space-y-2">
            {adminSections.map((section) => (
              <button
                key={section.section}
                onClick={() => fetchAdminData(section.section)}
                disabled={loading}
                className={`w-full text-left bg-card rounded-lg shadow-elevation p-4 border transition-all ${
                  selectedSection === section.section
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:shadow-elevation-md'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-3">{section.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1">{section.label}</h3>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  {loading && selectedSection === section.section && (
                    <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-destructive mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive mb-1">Erro ao carregar dados</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dados Administrativos */}
        {adminData && (
          <div className="bg-card rounded-lg shadow-elevation p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {adminSections.find(s => s.section === selectedSection)?.label}
              </h3>
              <button
                onClick={() => {
                  setAdminData(null)
                  setSelectedSection(null)
                }}
                className="p-2 text-muted-foreground hover:bg-accent rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Renderiza os dados de forma genérica */}
            {Array.isArray(adminData) ? (
              <div className="space-y-3">
                {adminData.map((item, index) => (
                  <div key={index} className="bg-accent rounded-lg p-4 border border-border">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="mb-3 last:mb-0">
                        <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-foreground">
                          {typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
                            ? formatDate(value)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(adminData).map(([key, value]) => (
                  <div key={key} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-medium text-foreground">
                      {typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2)
                        : typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
                        ? formatDate(value)
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Informação sobre endpoints */}
        {!adminData && !error && (
          <div className="bg-accent rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Selecione uma área administrativa para visualizar os dados
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
