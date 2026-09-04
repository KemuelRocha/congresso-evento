# Documentação — Congresso de Jovens 2026

Documentação funcional do sistema de inscrições do Congresso de Jovens 2026 (IEADPE Petrolina): o que existe, onde acessar, e do que cada parte depende.

## Visão Geral

- **Stack**: Next.js 15 (App Router, Turbopack) + React 19 + Tailwind CSS v4, com Firebase Firestore como banco de dados e Cloudinary para upload de comprovantes.
- **Domínios funcionais**: site público de divulgação/inscrição, dois fluxos de inscrição (Grande Coral e Vestibular Bíblico), painel administrativo e check-in de presença.

## Funcionalidades

### 1. Landing Page Pública — `/`

Página inicial do site: Header, Hero, contagem regressiva para o evento, seção "Sobre", programação dos 3 dias, localização (mapa incorporado) e rodapé. A partir dela se abrem os modais de inscrição.

- **Acesso**: público, sem autenticação.
- **Depende de**: `abertas/coral` e `abertas/vestibular` (Firestore) — flags que controlam a exibição dos botões de inscrição, lidas em tempo real pelo hook `useInscricoesStatus` ([app/hooks/useInscricoesStatus.ts](app/hooks/useInscricoesStatus.ts)).
- **Como abrir/fechar as inscrições**: não existe UI para isso — é preciso editar diretamente no Firestore Console o campo `ativo` (boolean) dos documentos `abertas/coral` e `abertas/vestibular`.

### 2. Inscrição — Grande Coral

Modal aberto a partir do Header/Hero (`RegisterModal.tsx`). Formulário com área, congregação, nome, sexo, se é jovem ou liderança, data de nascimento (idade mínima 14 anos até 29/11/2026), número do cartão de membro e WhatsApp. A partir de 2026 o fardamento é exclusivamente a camisa oficial, então o formulário não exibe mais fotos/consentimento de fardamento adicional.

- **Acesso**: público, condicionado a `abertas/coral.ativo == true`.
- **Grava em**: coleção `inscricoes` (campos: `nome`, `nomeLower`, `sexo`, `idade`, `lideranca`, `whatsapp`, `area`, `congregacao`, `cartaoMembro`, `codigo`, `createdAt`).
- **Código gerado**: sequencial `CJ2026-0001`, `CJ2026-0002`... via transação Firestore contra `counters/inscricoes` ([app/services/salvarInscricao.ts](app/services/salvarInscricao.ts)).
- **Regra de negócio**: não permite duas inscrições com o mesmo `cartaoMembro`.

### 3. Inscrição — Vestibular Bíblico

Modal em 3 etapas (`RegisterVestibularModal.tsx`): formulário → pagamento via PIX (com upload obrigatório do comprovante) → confirmação.

- **Acesso**: público, condicionado a `abertas/vestibular.ativo == true` **e** a uma data-limite fixa no código (`2026-09-12T23:59:59`).
- **Link direto — `/vestibular`**: rota dedicada que carrega a landing normalmente e já abre o modal de inscrição do Vestibular automaticamente (via `LandingPage` com `autoOpen="vestibular"`, em [app/vestibular/page.tsx](app/vestibular/page.tsx)). Útil para divulgar um link específico quando só o Vestibular está com inscrições abertas (o Grande Coral tem o mesmo mecanismo disponível, bastando usar `autoOpen="coral"` numa rota equivalente caso necessário no futuro).
- **Grava em**: coleção `vestibular` (campos: `nome`, `idade`, `dataNascimento`, `whatsapp`, `area`, `congregacao`, `cartaoMembro`, `comprovante` [URL Cloudinary], `codigo`, `createdAt`).
- **Código gerado**: sequencial `VB2026-0001`... via `counters/vestibular` ([app/services/salvarVestibular.ts](app/services/salvarVestibular.ts)).
- **Upload de comprovante**: `POST /api/upload`, envia o arquivo para o Cloudinary (pasta `comprovantes`).
- **Regra de negócio**: idade mínima 17 anos; não permite duas inscrições com o mesmo `cartaoMembro`.
- ⚠️ **Nota**: o link `/vestibular` abre o formulário independente da flag `abertas/vestibular` — ele só é bloqueado pela data-limite (`12/09/2026`) já embutida no componente. Se as inscrições forem encerradas manualmente antes dessa data (desligando a flag), o link direto ainda abriria o formulário; considere isso ao divulgar o link.

### 4. Confirmação de Inscrição

Após qualquer uma das duas inscrições acima, `ConfirmacaoInscricao.tsx` exibe o código gerado com um QR Code (`qrcode.react`) e permite baixar um PDF de comprovante (gerado no navegador via `html-to-image` + `jsPDF`).

### 5. Painel Administrativo — `/adm`

Dashboard interno com login, filtros, tabelas, exportação CSV e gráficos para as duas inscrições.

- **Acesso**: protegido por um formulário de login que compara o usuário/senha digitados contra `NEXT_PUBLIC_ADMIN_USER` / `NEXT_PUBLIC_ADMIN_PASS`.
  - ⚠️ **Nota de segurança (pré-existente, fora do escopo deste refactor)**: essa comparação acontece inteiramente no navegador e as variáveis, por serem `NEXT_PUBLIC_`, ficam expostas no bundle JS público — **não é autenticação de servidor**. Qualquer pessoa que inspecionar o código do site consegue ler usuário e senha. Recomenda-se migrar para um mecanismo de autenticação real (ex: Firebase Auth + regras de segurança do Firestore) antes de tratar este painel como protegido.
- **O que faz**:
  - KPIs: total de vagas (`vagas/total`), total de inscrições, vagas restantes, % de ocupação.
  - Busca e filtros (nome/código/cartão/WhatsApp, área, congregação, sexo, jovem/liderança, período de data de criação) com paginação, para `inscricoes`.
  - Exportação CSV dos resultados filtrados.
  - Gráficos (Recharts): por área, por congregação, por sexo, por faixa etária, jovens × lideranças.
  - Seção equivalente para `vestibular`: busca/filtros/paginação, exportação CSV, link para o comprovante enviado (com conversão automática de PDF para thumbnail JPG via Cloudinary), gráfico por área.
- **Depende de**: coleções `inscricoes`, `vestibular`, `vagas/total`.

### 6. Check-in / Registro de Presença — `/presenca`

Tela standalone (não usa o Header/Footer do site) para marcar presença dos inscritos nos ensaios do Grande Coral.

- **Acesso**: público — **qualquer pessoa com o link consegue marcar presença**, não há login. Se isso não for desejado, considere restringir o acesso (fora do escopo deste refactor visual).
- **O que faz**: busca o inscrito por nome ou código (`useFindInscrito`) ou via leitura de QR Code (`QRScanner.tsx`, usando `@zxing/browser`); ao confirmar, grava `presencas.<data ISO>: true` no documento correspondente em `inscricoes`. A tela reseta automaticamente 5 segundos após confirmar.
- **Depende de**: coleção `inscricoes`.

## Rotas de API

| Rota | Método | Descrição |
|---|---|---|
| `/api/upload` | POST | Recebe um arquivo (`multipart/form-data`) e envia para o Cloudinary (pasta `comprovantes`). Usada pelo fluxo de pagamento do Vestibular Bíblico. |
| `/api/grande-coral` | GET | Retorna todos os documentos de `inscricoes` ordenados por área/nome. **Não é consumida por nenhuma tela hoje** — o painel `/adm` consulta o Firestore diretamente no client. Parece código legado. |
| `/api/vestibular` | GET | Retorna todos os documentos de `vestibular`. **Também não é consumida** pelo painel atual, pelo mesmo motivo acima. |

## Modelo de Dados (Firestore)

| Coleção / Documento | Descrição |
|---|---|
| `inscricoes` | Inscrições do Grande Coral. Campos principais: `nome`, `nomeLower`, `sexo`, `idade`, `lideranca`, `whatsapp`, `area`, `congregacao`, `cartaoMembro`, `codigo`, `createdAt`, `presencas.<data>` (mapa de booleanos por dia). |
| `vestibular` | Inscrições do Vestibular Bíblico. Campos: `nome`, `idade`, `dataNascimento`, `whatsapp`, `area`, `congregacao`, `cartaoMembro`, `comprovante`, `codigo`, `createdAt`. |
| `counters/inscricoes` | Contador (`lastCodigo`) usado para gerar os códigos `CJ2026-XXXX`. |
| `counters/vestibular` | Contador (`lastCodigo`) usado para gerar os códigos `VB2026-XXXX`. |
| `abertas/coral` | Flag (`ativo: boolean`) que liga/desliga a exibição do botão de inscrição no Grande Coral. |
| `abertas/vestibular` | Flag (`ativo: boolean`) equivalente para o Vestibular Bíblico. |
| `vagas/total` | Documento com campo `valor` (número total de vagas), usado para calcular vagas restantes e % de ocupação no `/adm`. |

> Resetar o sistema (apagar todos os dados) significa apagar as coleções `inscricoes`, `vestibular` e `counters` no Firestore Console — elas são recriadas automaticamente na próxima inscrição.

> ⚠️ **Virada de ano/edição (ex: 2025 → 2026)**: o prefixo do código (`CJ2026-`/`VB2026-`) já está atualizado no código-fonte, mas o **número sequencial não reinicia sozinho** — ele continua de onde parou em `counters/inscricoes` / `counters/vestibular`. Se a intenção é a nova edição começar em `CJ2026-0001`/`VB2026-0001`, é preciso apagar (ou zerar o campo `lastCodigo` de) esses dois documentos no Firestore Console antes de abrir as inscrições.

## Variáveis de Ambiente

Ver [.env.example](.env.example) para a lista completa com comentários. Resumo:

- **Firebase** (`NEXT_PUBLIC_FIREBASE_*`): configuração do SDK client-side, usada em [app/services/firebase.ts](app/services/firebase.ts).
- **Cloudinary** (`CLOUDINARY_*`, sem prefixo `NEXT_PUBLIC_`): usadas só no servidor, em [app/api/upload/route.ts](app/api/upload/route.ts).
- **Admin** (`NEXT_PUBLIC_ADMIN_USER`/`NEXT_PUBLIC_ADMIN_PASS`): credenciais do login do `/adm` — ver nota de segurança na seção 5 acima.

## Sistema de Design

- Tokens de marca definidos em [app/globals.css](app/globals.css) via `@theme` (Tailwind v4, CSS-first): paleta `primary` (verde), `secondary` (slate), `accent` (dourado), `neutral`, cores semânticas (`success`/`error`/`warning`/`info`), radius e shadow.
- Tipografia: `font-sans` (Roboto, corpo de texto) e `font-display` (Roboto Condensed, títulos/hero/contagem regressiva), configuradas em [app/layout.tsx](app/layout.tsx).
- Componentes reutilizáveis em [app/components/ui/](app/components/ui/): `Button`, `Input`, `Select`, `Checkbox`, `Card`, `Badge`, `Table` (+ `TableHead`/`TableRow`/`TableCell`/`TableHeaderCell`), `PageSection`, `Modal`.
- Convenção: nunca usar cores cruas do Tailwind (`bg-green-600`, `text-gray-500` etc.) em código novo — sempre os tokens (`bg-primary-600`, `text-neutral-500`...).
