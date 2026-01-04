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

A aplicação está configurada para usar um **proxy durante o desenvolvimento** que redireciona requisições de `/api` para `http://localhost:8000` (removendo o prefixo `/api`). Isso evita problemas de CORS.

- **Desenvolvimento**: As requisições vão para `/api` (proxy do Vite remove o prefixo e redireciona para `http://localhost:8000`)
- **Produção**: Configure a URL completa no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

**Importante**: Certifique-se de que sua API está rodando em `http://localhost:8000` antes de iniciar o app.

## 📱 Funcionalidades

- ✅ Login com JWT
- ✅ Dashboard com KPIs
- ✅ Lista de pedidos com filtros
- ✅ Busca por nome ou ID
- ✅ Detalhes do pedido
- ✅ Atualização de status
- ✅ Relatórios (Envio, Fechamento, Vendas, Clientes, Produtos)
- ✅ Área Administrativa (Usuários, Configurações, Backup, Logs, Sistema)
- ✅ PWA instalável com Service Worker
- ✅ Funcionamento offline
- ✅ Atualizações automáticas

## 🏗️ Estrutura

```
src/
 ├─ api/          # Cliente HTTP
 ├─ auth/         # Autenticação
 ├─ pages/        # Páginas
 ├─ components/   # Componentes reutilizáveis
 └─ hooks/        # Hooks customizados
```

## 📱 PWA - Progressive Web App

### Ícones PWA

Os ícones PWA são gerados automaticamente a partir do arquivo `public/icon.svg`. Para regenerar os ícones:

```bash
pnpm run generate-icons
```

Isso gerará:
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)
- `apple-touch-icon.png` (180x180 pixels para iOS)

### Build de Produção

Para gerar o build de produção:

```bash
pnpm run build
```

O build será gerado na pasta `dist/`.

Para testar o build localmente:

```bash
pnpm run preview
```

### Configuração de Produção

1. Copie o arquivo `.env.production.example` para `.env.production`:
   ```bash
   cp .env.production.example .env.production
   ```

2. Configure a URL da sua API no arquivo `.env.production`:
   ```env
   VITE_API_URL=https://sua-api.com
   ```

3. Faça o build:
   ```bash
   pnpm run build
   ```

### Requisitos para PWA

- ✅ **HTTPS**: Em produção, o PWA requer HTTPS (exceto localhost)
- ✅ **Service Worker**: Configurado automaticamente pelo `vite-plugin-pwa`
- ✅ **Manifest**: Gerado automaticamente durante o build
- ✅ **Ícones**: Gerados a partir do SVG em `public/icon.svg`

### Instalação no Dispositivo

O PWA pode ser instalado em:
- **Android**: Chrome mostrará prompt de instalação
- **iOS**: Compartilhar → Adicionar à Tela de Início
- **Desktop**: Chrome/Edge mostrará ícone de instalação na barra de endereços

