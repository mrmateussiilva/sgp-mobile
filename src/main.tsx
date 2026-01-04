import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // O vite-plugin-pwa já registra automaticamente, mas garantimos que está funcionando
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          // Notifica quando há atualização disponível
          if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
            window.location.reload()
          }
        },
        onOfflineReady() {
          // App está pronto para funcionar offline
        },
        onRegistered(registration) {
          // Service Worker registrado com sucesso
        },
        onRegisterError(error) {
          // Erro ao registrar Service Worker
        },
      })
    }).catch(() => {
      // Em desenvolvimento, o virtual:pwa-register pode não estar disponível
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

