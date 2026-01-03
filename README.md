# SGP Mobile - PWA Administrativo

PWA mobile-first para administradores consultarem e atualizarem status de pedidos.

## 🚀 Tecnologias

- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router
- PWA (Service Worker + Manifest)

## 📦 Instalação

```bash
pnpm install
```

## 🏃 Executar

```bash
pnpm run dev
```

O app estará disponível em `http://localhost:3000`

## 🔧 Configuração

### API

A aplicação está configurada para usar um **proxy durante o desenvolvimento** que redireciona requisições de `/api` para `http://localhost:8000`. Isso evita problemas de CORS.

- **Desenvolvimento**: As requisições vão para `/api` (proxy do Vite)
- **Produção**: Configure a URL completa no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

**Importante**: Certifique-se de que sua API está rodando em `http://localhost:8000` antes de iniciar o app.

## 📱 Funcionalidades

- ✅ Login com JWT
- ✅ Dashboard com KPIs
- ✅ Lista de pedidos com filtros
- ✅ Busca por nome ou ID
- ✅ Detalhes do pedido
- ✅ Atualização de status
- ✅ PWA instalável

## 🏗️ Estrutura

```
src/
 ├─ api/          # Cliente HTTP
 ├─ auth/         # Autenticação
 ├─ pages/        # Páginas
 ├─ components/   # Componentes reutilizáveis
 └─ hooks/        # Hooks customizados
```

## 📱 Ícones PWA

Para gerar os ícones PWA (192x192 e 512x512), você pode:

1. Usar uma ferramenta online como [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
2. Criar manualmente e salvar em `public/pwa-192x192.png` e `public/pwa-512x512.png`

O app funcionará sem os ícones, mas eles são recomendados para uma melhor experiência PWA.

