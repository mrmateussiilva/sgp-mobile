import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../auth/useAuth'
import { apiClient } from '../api/client'
import { formatDatePtBR, getCurrentMonthStartKeyLocal, getTodayKeyLocal } from '../utils/date'

type ReportType = 'envio' | 'fechamento' | 'vendas' | 'clientes' | 'produtos'

interface ReportData {
  [key: string]: any
}

export const Reports = () => {
  const { logout } = useAuth()
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    start: getCurrentMonthStartKeyLocal(),
    end: getTodayKeyLocal(),
  })

  const reportTypes: Array<{ type: ReportType; label: string; icon: string; description: string }> = [
    { type: 'envio', label: 'Relatório de Envio', icon: '📦', description: 'Pedidos enviados no período' },
    { type: 'fechamento', label: 'Relatório de Fechamento', icon: '📊', description: 'Fechamentos e totais' },
    { type: 'vendas', label: 'Relatório de Vendas', icon: '💰', description: 'Análise de vendas' },
    { type: 'clientes', label: 'Relatório de Clientes', icon: '👥', description: 'Informações de clientes' },
    { type: 'produtos', label: 'Relatório de Produtos', icon: '📋', description: 'Produtos mais vendidos' },
  ]

  const fetchReport = async (reportType: ReportType) => {
    setLoading(true)
    setError(null)
    setReportData(null)

    try {
      // Tenta diferentes endpoints possíveis
      const endpoints = [
        `/relatorios/${reportType}`,
        `/relatorios/${reportType}/`,
        `/report/${reportType}`,
        `/reports/${reportType}`,
        `/admin/relatorios/${reportType}`,
      ]

      let data: ReportData | null = null
      let lastError: Error | null = null

      for (const endpoint of endpoints) {
        try {
          data = await apiClient.get<ReportData>(`${endpoint}?data_inicio=${dateRange.start}&data_fim=${dateRange.end}`)
          break
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Erro desconhecido')
          continue
        }
      }

      if (!data) {
        throw lastError || new Error('Nenhum endpoint de relatório encontrado')
      }

      setReportData(data)
      setSelectedReport(reportType)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number | string | null | undefined) => {
    if (!value) return 'R$ 0,00'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
  }

  const formatDate = (dateString: string | null | undefined) => {
    return formatDatePtBR(dateString)
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <header className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
        <div className="px-4 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Análises e estatísticas</p>
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
        {/* Filtro de Data */}
        <div className="bg-card rounded-lg shadow-elevation p-4 mb-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Período</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Data Início</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Data Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          </div>
        </div>

        {/* Lista de Relatórios */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-foreground mb-3">Tipos de Relatório</h2>
          <div className="space-y-2">
            {reportTypes.map((report) => (
              <button
                key={report.type}
                onClick={() => fetchReport(report.type)}
                disabled={loading}
                className={`w-full text-left bg-card rounded-lg shadow-elevation p-4 border transition-all ${
                  selectedReport === report.type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:shadow-elevation-md'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-3">{report.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-foreground mb-1">{report.label}</h3>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                  {loading && selectedReport === report.type && (
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
                <p className="text-sm font-semibold text-destructive mb-1">Erro ao carregar relatório</p>
                <p className="text-xs text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Dados do Relatório */}
        {reportData && (
          <div className="bg-card rounded-lg shadow-elevation p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {reportTypes.find(r => r.type === selectedReport)?.label}
              </h3>
              <button
                onClick={() => {
                  setReportData(null)
                  setSelectedReport(null)
                }}
                className="p-2 text-muted-foreground hover:bg-accent rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Renderiza os dados do relatório de forma genérica */}
            <div className="space-y-4">
              {Object.entries(reportData).map(([key, value]) => (
                <div key={key} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">{key.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-medium text-foreground">
                    {typeof value === 'number'
                      ? (key.toLowerCase().includes('valor') || key.toLowerCase().includes('total') || key.toLowerCase().includes('preco'))
                        ? formatCurrency(value)
                        : value.toLocaleString('pt-BR')
                      : typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
                      ? formatDate(value)
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>

            {/* Se for um array, renderiza como lista */}
            {Array.isArray(reportData) && (
              <div className="space-y-2">
                {reportData.map((item, index) => (
                  <div key={index} className="bg-accent rounded-lg p-3 border border-border">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="mb-2 last:mb-0">
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-foreground">
                          {typeof value === 'number'
                            ? (key.toLowerCase().includes('valor') || key.toLowerCase().includes('total') || key.toLowerCase().includes('preco'))
                              ? formatCurrency(value)
                              : value.toLocaleString('pt-BR')
                            : typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
                            ? formatDate(value)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
