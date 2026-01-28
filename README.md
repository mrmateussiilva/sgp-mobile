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

O app conecta-se diretamente à API para evitar complexidade com proxies e garantir compatibilidade máxima em PWA.

### Variáveis de Ambiente

Para configurar a conexão, utilize as variáveis de ambiente no arquivo `.env` (ou nas configurações do seu provedor de deploy):

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base do backend (sem prefixo /api) | `https://api.meusite.com` |

> [!TIP]
> Em modo de desenvolvimento (`pnpm run dev`), o app tentará se conectar por padrão ao IP `192.168.1.100:8000`. Você pode alterar isso na tela de fallback se necessário.

## 📱 Funcionalidades

- ✅ Login com JWT
- ✅ Dashboard com KPIs e atalhos rápidos
- ✅ Lista de pedidos com filtros (Hoje, Pendentes, Produção)
- ✅ Busca por nome, número ou ID
- ✅ Detalhes do pedido (Modo Leitura)
- ✅ Fallback de conexão com seleção de servidor (VPS / Local)
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

- **Desktop**: Chrome/Edge mostrará ícone de instalação na barra de endereços

## 🚀 Deploy na Vercel

O deploy deste projeto na Vercel é simples e otimizado para Vite.

### Passo a Passo:

1. Importe o repositório no [Vercel Dashboard](https://vercel.com/new).
2. Na seção **Environment Variables**, adicione:
   - `VITE_API_URL`: O endereço da sua API pública.
3. Clique em **Deploy**.

### Configurações Adicionais:
- **Framework Preset**: Vite (detectado automaticamente)
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

> [!IMPORTANT]
> Certifique-se de que o backend configurado em `VITE_API_URL` tenha as permissões de **CORS** habilitadas para o domínio gerado pela Vercel.

