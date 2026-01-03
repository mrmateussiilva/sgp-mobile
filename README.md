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

A URL padrão da API é `http://localhost:8000/api`. 

Se precisar alterar, configure no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

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

