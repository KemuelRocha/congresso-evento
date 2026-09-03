# Congresso de Jovens 2026 — Sistema de Inscrições

Site oficial e sistema de inscrições do Congresso de Jovens 2026 (IEADPE Petrolina): landing page, inscrição no Grande Coral, inscrição no Vestibular Bíblico, painel administrativo e check-in de presença.

Para o detalhamento de cada funcionalidade, rotas, coleções do Firestore e regras de negócio, veja [DOCS.md](DOCS.md).

## Stack Tecnológica

- [Next.js 15](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (configuração CSS-first via `@theme`)
- [Firebase Firestore](https://firebase.google.com/docs/firestore) — banco de dados
- [Cloudinary](https://cloudinary.com) — upload de comprovantes de pagamento
- [Framer Motion](https://www.framer.com/motion/) — animações (modais)
- [Recharts](https://recharts.org) — gráficos do painel administrativo
- [Swiper](https://swiperjs.com) — carrossel de fotos
- `qrcode.react` + `@zxing/browser` — geração e leitura de QR Code
- `html-to-image` + `jspdf` — geração de PDF de confirmação no navegador
- `file-saver` — exportação de CSV

## Estrutura do Projeto

```
app/
├── page.tsx                 # Landing page (/)
├── layout.tsx                # Layout raiz, fontes e metadata
├── globals.css               # Tokens de design (Tailwind v4 @theme)
├── adm/page.tsx               # Painel administrativo (/adm)
├── presenca/page.tsx          # Check-in de presença (/presenca)
├── api/                       # Rotas de API (upload, grande-coral, vestibular)
├── components/                 # Componentes de página (Header, Hero, RegisterModal...)
│   └── ui/                     # Componentes de UI reutilizáveis (Button, Input, Card...)
├── hooks/                      # Hooks (status das inscrições, busca de inscrito)
├── services/                   # Integração com Firebase e regras de gravação
└── mock/                       # Dados estáticos (áreas/congregações)
```

## Pré-requisitos

- Node.js 20+
- Uma conta e projeto no [Firebase](https://console.firebase.google.com/) (Firestore habilitado)
- Uma conta no [Cloudinary](https://cloudinary.com)

## Configuração

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Copie o arquivo de exemplo de variáveis de ambiente e preencha com os valores reais:
   ```bash
   cp .env.example .env.local
   ```
   Veja o significado de cada variável em [.env.example](.env.example) e em [DOCS.md](DOCS.md#variáveis-de-ambiente).
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção (Turbopack) |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | Executa o ESLint |

## Documentação

Consulte [DOCS.md](DOCS.md) para a lista completa de funcionalidades, rotas de API, modelo de dados do Firestore e notas de segurança conhecidas (ex: autenticação do painel `/adm`).

## Sistema de Design

O projeto usa um sistema de tokens (cores, tipografia, radius, sombra) definido em `app/globals.css`, e componentes de UI reutilizáveis em `app/components/ui/`. Veja o resumo em [DOCS.md — Sistema de Design](DOCS.md#sistema-de-design).
