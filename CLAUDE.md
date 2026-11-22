# CLAUDE.md — IFO V2 (Inteligência Financeira Organizada)

Contexto fixo para o Claude. Leia antes de qualquer tarefa. Se algo aqui contradisser um pedido, pare e pergunte.

## 1. O projeto
- App de controle financeiro pessoal em português, com a regra 50/30/20 (Necessidades / Lazer / Investimentos).
- Projeto acadêmico da FATEC Cotia (DSM, 2º semestre de 2026). Evolução do IFO V1 (Java + Spring Boot + PostgreSQL).
- Integra 4 disciplinas: Banco de Dados Não Relacional, Gestão Ágil, IHC e Desenvolvimento Web III.
- Equipe (5): João Marcos Vilaça Marques, Lucas de Souza Saldanha dos Santos, Amanda Freitas de Lima, Vinicius de Amorim Farias e Jetro Pereira.
- Estado atual: só escopo, logo e protótipo HTML. **Ainda não existe back-end, banco nem front React.**

## 2. Combinados de trabalho (valem sempre)
- **Git/GitHub:** o João pode rodar os comandos ou pedir que o Claude rode. Quando o Claude rodar, só executa o que o João mandar ("pode rodar"), passo a passo, mostrando o comando antes de `add`, `commit` e `push`. Nunca faz merge nem abre PR sem pedido.
- Nunca usar `--no-verify`, `push --force` ou `reset --hard` sem o João pedir.
- Explicar de forma muito didática **só depois de terminar os itens da parte**: o que cada arquivo faz, com quem conversa e por quê. Explicar também cada comando de Git.
- Antes de commitar, conferir `git status`; avisar se aparecer arquivo inesperado (`.env`, zips, arquivos do editor).
- O Claude gera um `.md` temporário (no scratchpad, nunca no repositório) com o texto do PR, terminando com a linha de atribuição de PR.
- Commits em Conventional Commits: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`. Título em português, imperativo e curto; um commit por assunto. Título do PR: `feat: ... (R2 parte 3)`.
- A atribuição do commit vai como segundo `-m`: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. No PR: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Uma branch e um PR por parte da sprint. Plano em partes pequenas antes de codar. Decisão nova de arquitetura vira ADR.
- **Dependência nova (ou troca de dependência): avisar antes.**
- Só dizer "pronto" com a suíte completa verde e o **número de testes** informado. O que não deu para verificar, dizer.
- Segredos (senhas, chaves, URLs com senha) nunca no chat nem no Git.
- Responder em português do Brasil, tom direto.

### Ciclo de cada parte
1. `git switch main` → `git pull` → `git status` (limpo) → `git switch -c feature/<sprint>-<assunto>`.
2. Claude codifica, roda a suíte inteira, confere o `git status` esperado e escreve o texto do PR.
3. `git status` → `git add <arquivos>` → `git commit -m "<tipo>: <título>" -m "<atribuição>"`.
4. `git push -u origin <branch>` → PR no GitHub → merge pelo João.
5. `git switch main` → `git pull` → `git branch -d <branch>`.

### Sprints e branches
- Sprints têm código **R0 a R6** ("R" de rodada/sprint). Não confundir com a refatoração R0–R6 do IFO V1: são projetos diferentes.
- Cada sprint se divide em partes numeradas ("R2 parte 3"). Uma parte = uma branch = um PR.
- Branch: `feature/<sprint em minúsculo>-<assunto-em-kebab-case>`, sem acento. Ex.: `feature/r1-cadastro-login`.
- Fora de sprint: `feature/docs-<assunto>` ou `fix/<assunto>`.
- Branch principal: **`main`**.

## 3. Documentação (fonte da verdade)
`docs/*.md` é a fonte da verdade. O `docs/Escopo_IFO_V2.pdf` (v3.3) é referência histórica. Se o código divergir da doc, atualizar a doc **na mesma parte**. Item novo só entra na sprint com decisão registrada.

| Arquivo | Papel |
|---|---|
| `docs/01-escopo.md` | Visão, dentro/fora do escopo, premissas, riscos, critérios do piloto de IA |
| `docs/02-requisitos.md` | RF01–RF25, requisitos não funcionais, regras de negócio |
| `docs/03-metodologia.md` | Scrum leve, fluxo Git, Definition of Done, testes |
| `docs/04-modelo-de-dados.md` | Tabelas MySQL e coleções MongoDB |
| `docs/05-api.md` | Contrato dos endpoints e formato de erro |
| `docs/06-arquitetura-e-ia.md` | Camadas, 2FA/JWT, jobs, agente de IA |
| `docs/07-roadmap.md` | Sprints R0–R6, backlog com checkboxes, tabela de ADRs |
| `docs/08-licoes-da-v1.md` | Problemas do V1 a não repetir |

Pontos marcados como **[proposta]** em `04`, `05` e `06` valem depois da revisão do PR; decisões abertas viram ADR no `07`.

## 4. Stack (decidida no escopo v3.3)
| Camada | Tecnologia |
|---|---|
| Backend | Node.js + Express, MVC: `routes → controllers → services → models` |
| Relacional | MySQL + Sequelize (usuários e códigos 2FA) |
| NoSQL | MongoDB + Mongoose (transações, categorias, orçamentos, metas, etc.) |
| Frontend | React (Vite) + Tailwind CSS, sem biblioteca de componentes |
| Validação | Zod: corpo, query, params e ambiente (ADR-015) |
| Testes | Vitest + Supertest (ADR-016) |
| Runtime | Node 24 + npm, ESM; `--env-file` e `--watch`, sem dotenv/nodemon (ADR-017) |
| Bancos locais | MongoDB em Docker; MySQL local do Windows (ADR-018) |
| Gráficos | Chart.js (react-chartjs-2) |
| E-mail / 2FA | Resend (plano B em dev: código no log do servidor) |
| Agente de IA (piloto) | Google AI Studio (Gemini, gratuito); reserva OpenRouter (`:free`) |
| Design | Protótipos visuais feitos direto em HTML (`prototipo/index.html`) |
| Entrega | Ambiente local, sem deploy em nuvem |

## 5. Estrutura de pastas
Atual: `docs/` (PDF), `Logo/`, `prototipo/index.html`, `README.md`.
Planejada (a confirmar na R0):
```
raiz/ CLAUDE.md README.md .gitignore .env.example docs/ prototipo/ Logo/
├─ backend/ src/{routes,controllers,services,models,middlewares,jobs,config}  tests/
└─ frontend/ src/{paginas,componentes,servicos,hooks,contextos}
```

## 6. Regras do backend
- Validar a entrada em **todas** as rotas. Erros em formato único (ver `docs/05-api.md`).
- Senha com bcrypt (mínimo 8 caracteres). Código 2FA guardado com **hash**: 6 dígitos, 10 min, uso único, 5 tentativas.
- Sessão: JWT em **cookie httpOnly**, SameSite=Lax. Logout apaga o cookie. Sem tabela de sessões.
- Dado de outro usuário responde igual a inexistente (404). Toda consulta filtra por `usuarioId` do token.
- Dinheiro: `Decimal128` no Mongo, nunca `Number` em cálculo. Arredondar só no resultado final.
- Vínculo `usuarioId` (Mongo) → `usuarios.id` (MySQL) é **lógico**, sem chave estrangeira.
- Alerta de orçamento (80% atenção, 100% estouro) **nunca bloqueia** o lançamento.
- Recorrências: job diário (node-cron), idempotente por competência `AAAA-MM`.
- CSV: `Data;Tipo;Grupo;Categoria;Descrição;Valor`, separador `;`, vírgula decimal, datas dd/MM/aaaa, UTF-8 com BOM; texto iniciado por `=`, `+`, `-` ou `@` ganha apóstrofo; só dados do usuário logado.
- Segredos só em variáveis de ambiente (`.env` fora do Git, modelo em `.env.example`).
- Modelo de despesa: **Grupo → Categoria → Descrição**. Categorias padrão não podem ser excluídas; o usuário cria as próprias. Orçamento sempre pelo grupo.

## 7. Regras do agente de IA (piloto, R6)
- Princípio (herdado do MFA): **o código decide; a IA só escreve.** A IA nunca altera dados nem números calculados.
- Agente **somente leitura**, atrás da chave `AI_AGENT_ENABLED`, via service `aiProvider`. Chamada só pelo backend.
- Contexto enviado: totais agregados (mês atual e anterior), orçamentos, metas e renda. **Sem nome, e-mail ou descrições.**
- Limites: 20 perguntas por usuário por dia, 15 s por resposta. Registro em `historico_acoes` (`IA_PERGUNTA`); conteúdo das conversas não é gravado.
- Falha ou limite de API: cair para a reserva e depois para mensagem fixa, sem derrubar o app.
- Chave de API só em header e só em variável de ambiente. Mensagens de erro nunca incluem o corpo da resposta do provedor.
- Critérios para o piloto permanecer: 8/10 perguntas de teste corretas, mediana ≤ 5 s, nenhuma falha de limite na demo, revisão confirmando que nenhum dado pessoal sai. Se falhar, o agente é removido.

## 8. Frontend e IHC
- O frontend só exibe e formata; **regra e dinheiro ficam no backend**.
- Responsivo a partir de 360 px, dark mode (classe `dark` do Tailwind, escolha em `localStorage`), feedback de carregamento, sucesso e erro.
- Alvos de toque ≥ 40 px. Considerar zoom de 200% e leitor de tela (pendências do estudo de IHC).
- O `prototipo/index.html` é só referência visual; o login demo e o "Painel do protótipo" não existirão no produto.

## 9. Ambiente (Windows 11)
- Shell principal: PowerShell. Caminhos têm acento e espaço: **sempre entre aspas**.
- Respeitar a quebra de linha do arquivo (CRLF) ao editar.
- Python pode não estar no PATH; não depender dele nos scripts do projeto (usar Node ou shell).
- Comandos de build e teste serão listados aqui quando o código existir (R0 parte do setup).

## 10. Fases do projeto
| Sprint | Meta | Requisitos | Estado |
|---|---|---|---|
| R0 | Setup, docs, bancos locais, MVC, Vite/React/Tailwind, protótipo HTML, chaves de teste | — | em andamento |
| R1 | Cadastro, login, 2FA, logout, perfil | RF01–RF04 | pendente |
| R2 | Categorias, CRUD de transações, filtros, CSV | RF05–RF10 | pendente |
| R3 | Dashboard interativo e painel 50/30/20 | RF12–RF14 | pendente |
| R4 | Orçamento com alertas, metas e simulador | RF15–RF18 | pendente |
| R5 | Recorrências, dark mode, análise, histórico, polimento, testes finais do MVP | RF11, RF19–RF22 | pendente |
| R6 | Agente de IA (piloto) | RF23–RF25 | pendente |

Riscos: dois bancos (R1 só MySQL, Mongo entra na R2); R5 carregada (cortar RF11 e RF21–RF22 primeiro); domínio do Resend; limite da API de IA.

## 11. Checklist antes de dizer "pronto"
1. Suíte completa verde, com o número de testes informado (se houver código).
2. `git status` só com os arquivos da parte.
3. Item marcado em `docs/07-roadmap.md` e docs atualizadas se o contrato mudou.
4. Texto do PR criado no scratchpad (caminho completo informado).
5. Explicação didática entregue, seguida do passo a passo de Git.
