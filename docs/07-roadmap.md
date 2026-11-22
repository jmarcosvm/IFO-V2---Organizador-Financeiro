# 07 · Roadmap

> Sprints com código **R0 a R6**. Cada sprint se divide em **partes pequenas** (uma branch, um PR). As partes de R1 em diante são um **plano inicial**: refinadas no começo de cada sprint, com a decisão registrada aqui. Marque `[x]` e anote *(Parte N, PR #, nº de testes)* ao concluir.

## 1. Visão geral

| Sprint | Meta | Requisitos | Estado |
|---|---|---|---|
| R0 | Documentação e setup: docs, bancos locais, esqueleto MVC, Vite/React/Tailwind | — | em andamento (docs concluídos; setup pendente) |
| R1 | Conta e sessão: cadastro, login, 2FA, logout, perfil (só MySQL) | RF01–RF04 | pendente |
| R2 | Categorias, CRUD de transações, filtros e CSV (entra o MongoDB) | RF05–RF10 | pendente |
| R3 | Dashboard interativo e painel 50/30/20 | RF12–RF14 | pendente |
| R4 | Orçamento com alertas, metas e simulador | RF15–RF18 | pendente |
| R5 | Recorrências, dark mode, análise, histórico, polimento e testes finais do MVP | RF11, RF19–RF22 | pendente |
| R6 | Agente de IA (piloto) e decisão de manter ou remover | RF23–RF25 | pendente |

**Ordem de corte** (se faltar tempo): RF11 (recorrências) → RF22 (histórico) → RF21 (sugestão e projeção) → agente de IA inteiro (R6). O MVP fecha ao fim da R5.

## 2. Backlog detalhado

### R0 · Documentação e setup
- [x] **Parte 1** — `CLAUDE.md` e `.gitignore` *(PR #1)*. Como: combinados de trabalho, stack, regras, fases.
- [x] **Parte 2** — `docs/01` a `03`: escopo, requisitos, metodologia; pasta `Docs/` → `docs/` *(PR #2)*.
- [x] **Parte 3** — `docs/04` a `06`: modelo de dados, API, arquitetura e IA *(PR #3)*.
- [x] **Parte 4** — `docs/07` e `08`, ADRs iniciais e README atualizado *(PR #4)*. Branch `feature/r0-roadmap-adrs`.
- [x] **Parte 5** — Decisões da stack do backend: ADR-015 a ADR-018 (validação, testes, runtime e bancos locais) e ajustes nos docs *(este PR)*. Só documentação. Branch `feature/r0-adr-stack-backend`.
- [ ] **Parte 6** — Esqueleto do backend: `backend/` com Express, camadas MVC, rota `/api/saude`, `.env.example`, middleware de erro, validação Zod e testes (Vitest + Supertest). Branch `feature/r0-backend-esqueleto`.
- [ ] **Parte 7** — Bancos locais: MySQL + Sequelize e MongoDB (Docker) + Mongoose conectando; ADR de migrations/seed; instruções de subir os bancos no README. Branch `feature/r0-bancos-locais`.
- [ ] **Parte 8** — Esqueleto do frontend: Vite + React + Tailwind, tema claro/escuro, rota inicial, cliente HTTP único. Branch `feature/r0-frontend-esqueleto`.
- [ ] **Parte 9** — Contas e chaves de teste: Resend, Google AI Studio e OpenRouter (feito pelo usuário fora do código); GitHub Projects com o backlog. Branch `feature/r0-contas-backlog` (só docs, se houver).
- [ ] **ADRs pendentes de decisão**: ferramenta de migrations (parte 7) e política de cookie em ambiente local (R1 parte 1).

### R1 · Conta e sessão (RF01–RF04)
- [ ] **Parte 1** — Docs: ADR de expiração do JWT/cookie e do envio do 2FA. Branch `feature/r1-adr-sessao`.
- [ ] **Parte 2** — Cadastro (RF01): tabela `usuarios`, bcrypt, validação, orçamento padrão. Branch `feature/r1-cadastro`.
- [ ] **Parte 3** — Login e 2FA (RF02): `codigos_2fa` com hash, 10 min, 5 tentativas, envio por Resend (plano B: log). Branch `feature/r1-login-2fa`.
- [ ] **Parte 4** — Sessão e logout (RF03): JWT em cookie httpOnly, middleware de autenticação. Branch `feature/r1-sessao`.
- [ ] **Parte 5** — Perfil (RF04): GET/PUT `/api/perfil`. Branch `feature/r1-perfil`.
- [ ] **Parte 6** — Telas de acesso e perfil em React, a partir do protótipo. Branch `feature/r1-telas-acesso`.

### R2 · Categorias, transações e CSV (RF05–RF10)
- [ ] **Parte 1** — Docs/ADR e seed das categorias padrão (idempotente). Branch `feature/r2-adr-categorias`.
- [ ] **Parte 2** — Categorias (RF07): padrão + próprias. Branch `feature/r2-categorias`.
- [ ] **Parte 3** — CRUD de transações (RF05, RF06): tipo e grupo derivados da categoria; `Decimal128`. Branch `feature/r2-transacoes`.
- [ ] **Parte 4** — Transação prevista e confirmação (RF08) e filtros (RF09). Branch `feature/r2-prevista-filtros`.
- [ ] **Parte 5** — Exportação CSV (RF10): `;`, BOM, anti-injeção de fórmula. Branch `feature/r2-csv`.
- [ ] **Parte 6** — Telas de transações em React. Branch `feature/r2-telas-transacoes`.

### R3 · Dashboard (RF12–RF14)
- [ ] **Parte 1** — Endpoint de dashboard por período (RF12). Branch `feature/r3-dashboard-api`.
- [ ] **Parte 2** — Gráficos pizza, linha e barras com drill-down (RF13). Branch `feature/r3-graficos`.
- [ ] **Parte 3** — Painel 50/30/20 real × meta (RF14). Branch `feature/r3-painel-50-30-20`.

### R4 · Orçamento, metas e simulador (RF15–RF18)
- [ ] **Parte 1** — Orçamento por percentuais, soma 100%, herança do mês anterior (RF15). Branch `feature/r4-orcamento`.
- [ ] **Parte 2** — Alertas 80%/100% nas respostas de transação (RF16), com testes de borda (79,9 / 80 / 100 / 100,01). Branch `feature/r4-alertas`.
- [ ] **Parte 3** — Metas e aportes (RF17). Branch `feature/r4-metas`.
- [ ] **Parte 4** — Simulador no cliente (RF18). Branch `feature/r4-simulador`.

### R5 · Recorrências, análise e polimento (RF11, RF19–RF22)
- [ ] **Parte 1** — Dark mode completo (RF19). Branch `feature/r5-dark-mode`.
- [ ] **Parte 2** — Análise por regras vs. período anterior (RF20). Branch `feature/r5-analise`.
- [ ] **Parte 3** — Sugestão de economia e projeção (RF21, *cortável*). Branch `feature/r5-economia-projecao`.
- [ ] **Parte 4** — Histórico de ações (RF22, *cortável*). Branch `feature/r5-historico`.
- [ ] **Parte 5** — Recorrências: modelo, job node-cron idempotente, recuperação de meses (RF11, *cortável*). Branch `feature/r5-recorrencias`.
- [ ] **Parte 6** — Polimento de UI (pendências de IHC: menu "Mais", zoom 200%, acessibilidade) e testes finais do MVP. Branch `feature/r5-polimento-mvp`.

### R6 · Agente de IA (RF23–RF25)
- [ ] **Parte 1** — Docs/ADR do agente e checagem de privacidade do contexto. Branch `feature/r6-adr-agente`.
- [ ] **Parte 2** — Service `aiProvider` (Gemini → OpenRouter → mensagem fixa), flag e limites (RF24, RF25). Branch `feature/r6-ai-provider`.
- [ ] **Parte 3** — Chat e avaliação positiva/negativa (RF23, RF25). Branch `feature/r6-chat`.
- [ ] **Parte 4** — Avaliação do piloto: 10 perguntas, mediana de tempo, revisão de privacidade; decisão de manter ou remover. Branch `feature/r6-avaliacao-piloto`.

## 3. Checklist de qualidade por sprint
- [ ] Suíte completa verde, com o número de testes informado.
- [ ] Telas conferidas em 360 px, nos temas claro e escuro.
- [ ] Docs (`02`, `04`, `05`, `06`) atualizados se o contrato mudou.
- [ ] Nenhum segredo no Git (`git status` e revisão do diff).
- [ ] Item marcado neste roadmap.

## 4. ADRs (decisões de arquitetura)

| ID | Decisão | Motivo |
|---|---|---|
| ADR-001 | Equipe documentada com **5 integrantes** (README), não 4 (PDF v3.3) | O README é mais recente e inclui Jetro Pereira |
| ADR-002 | Backend em **Node.js + Express**, MVC `routes → controllers → services → models` | Exigência da disciplina Web III; separa regra de negócio de HTTP |
| ADR-003 | **Dois bancos**: MySQL (usuários, 2FA) e MongoDB (dados financeiros); vínculo lógico por `usuarioId`; R1 só MySQL, Mongo entra na R2 | Exigência de Banco Não Relacional; reduz o risco de complexidade inicial |
| ADR-004 | Sessão por **JWT stateless em cookie httpOnly**, SameSite=Lax; sem tabela de sessões | Evita expor o token ao JavaScript; simplicidade |
| ADR-005 | **2FA por e-mail** (Resend), código de 6 dígitos com hash, 10 min, 5 tentativas; plano B: código no log em dev | Segurança sem custo; domínio do Resend pode não estar verificado |
| ADR-006 | Frontend **React (Vite) + Tailwind**, sem biblioteca de componentes; gráficos com Chart.js | Controle total do visual e aprendizado; já usado no protótipo |
| ADR-007 | **Protótipos visuais feitos direto em HTML** (`prototipo/index.html`), sem Figma | Mais rápido de validar e de testar com IHC; substitui a etapa de Figma prevista no PDF |
| ADR-008 | Despesa modelada como **Grupo → Categoria → Descrição**; tipo e grupo derivados da categoria; orçamento sempre por grupo; categorias próprias permitidas | Categorias livres não quebram o 50/30/20 |
| ADR-009 | Alerta de orçamento **informativo**: atenção ≥ 80%, estouro > 100%, **nunca bloqueia** | Decisão herdada do IFO V1 (ADR-008 do V1) |
| ADR-010 | Recorrência como **modelo + job diário (node-cron) idempotente** por competência `AAAA-MM` | Evita duplicar lançamentos e permite recuperar meses perdidos |
| ADR-011 | **Agente de IA em piloto**: atrás de `AI_AGENT_ENABLED`, somente leitura, só dados agregados, "o código decide, a IA escreve"; removido se não cumprir os critérios | Reduz risco de privacidade e de respostas inventadas |
| ADR-012 | **`docs/*.md` é a fonte da verdade**; o PDF v3.3 fica como referência histórica; pasta renomeada `Docs/` → `docs/` | Markdown é versionável e revisável por PR |
| ADR-013 | Sprints com código **R0–R6** e partes numeradas; uma branch e um PR por parte; branch principal `main` | Rastreabilidade e revisão em PRs pequenos |
| ADR-014 | Exportação **CSV** com `;`, vírgula decimal, datas dd/MM/aaaa, UTF-8 com BOM e anti-injeção de fórmula | Abre corretamente no Excel brasileiro e é seguro |
| ADR-015 | **Zod** valida corpo, query, params e variáveis de ambiente | Um esquema só serve às duas tarefas; mensagens em português |
| ADR-016 | **Vitest + Supertest**; rota testada sem subir servidor; todo teste novo entra no "número de testes" | ESM nativo, saída clara, poucas dependências |
| ADR-017 | **Node 24 + npm + ESM**; `--env-file` e `--watch` no lugar de `dotenv` e `nodemon`; `app.js` separado de `server.js` | Menos dependências; `app.js` separado deixa o Supertest testar sem rede |
| ADR-018 | **MongoDB em Docker** (`docker-compose.yml`) e **MySQL local** do Windows; `.env.example` documenta as duas URLs | MongoDB não está instalado; ambiente repetível sem conflito na porta 3306 |

**Decisões ainda abertas** (viram ADR-019 em diante): ferramenta de migrations e seed (R0 parte 7), política de cookie em ambiente local e expiração do JWT (R1 parte 1), política de exclusão de conta (R1).
