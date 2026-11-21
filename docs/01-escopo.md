# 01 · Escopo

> Fonte: `docs/Escopo_IFO_V2.pdf` (v3.3, nov/2026), convertido para Markdown na R0 parte 2. A partir daqui, **este arquivo é a fonte da verdade**; o PDF fica como referência histórica.

## 1. Visão e objetivo
O IFO V2 (Inteligência Financeira Organizada) é um app web de controle financeiro pessoal em português, baseado na regra **50/30/20**: 50% da renda para Necessidades, 30% para Lazer e 20% para Investimentos.

É a evolução do IFO V1 (Java, Spring Boot e PostgreSQL), feito no semestre anterior. Na V2:
- o backend migra para **Node.js + Express**;
- a persistência usa **dois bancos**: MySQL (dados relacionais) e MongoDB (dados de uso financeiro);
- o frontend passa a ser **React**;
- entram gráficos interativos, 2FA por e-mail, análise inteligente **por regras** e, em piloto, um **agente de IA**.

O projeto é acadêmico (FATEC Cotia, curso DSM, 2º semestre de 2026) e integra quatro disciplinas:

| Disciplina | O que o IFO V2 entrega |
|---|---|
| Banco de Dados Não Relacional | Modelagem e uso do MongoDB ao lado do MySQL |
| Gestão Ágil | Sprints R0–R6, backlog no GitHub Projects, PRs revisados |
| IHC | Protótipo, estudo de usabilidade, acessibilidade e feedback ao usuário |
| Desenvolvimento Web III | Backend Node/Express e frontend React |

## 2. Equipe
João Marcos Vilaça Marques, Lucas de Souza Saldanha dos Santos, Amanda Freitas de Lima, Vinicius de Amorim Farias e Jetro Pereira.

> **Divergência registrada:** o PDF v3.3 lista 4 nomes (sem Jetro Pereira); o README lista 5. Vale o README (ver ADR-001 no `07-roadmap.md`).

## 3. Dentro do escopo
Resumo por área (detalhe e prioridade em `02-requisitos.md`):
- **Conta e segurança:** cadastro, login com 2FA por e-mail, logout, edição de perfil.
- **Transações:** CRUD, categorias padrão e próprias, filtros, transações previstas com confirmação, exportação CSV.
- **Recorrências:** despesas e receitas mensais geradas por job diário idempotente.
- **Dashboard:** seletor de período (mês, trimestre, semestre, ano), gráficos pizza, linha e barras com drill-down, painel 50/30/20.
- **Planejamento:** orçamento por percentuais, alertas em 80% e 100% (nunca bloqueiam), metas com aportes, simulador de investimentos.
- **Experiência:** dark mode, responsivo a partir de 360 px.
- **Análise por regras:** comparação com o período anterior, sugestão de economia, projeção do mês, histórico de ações.
- **Agente de IA (piloto, R6):** chat somente leitura sobre dados agregados do usuário.

## 4. Fora do escopo
- App mobile nativo.
- Open Finance e importação de extrato bancário.
- Treinar ou hospedar modelos de IA próprios.
- IA que altere dados (o agente é **somente leitura**).
- Deploy em produção (entrega em ambiente local).
- Notificações push e SMS.
- Perfil familiar / multiusuário compartilhado.
- Exportação em PDF.

## 5. Premissas
- O desenvolvimento e a demonstração rodam **localmente**: MySQL, MongoDB, API e frontend sobem na máquina, com README explicando o passo a passo.
- Existe uma conta de teste no Resend e chaves gratuitas das APIs de IA (Google AI Studio e OpenRouter).
- A base do 50/30/20 é a `renda_mensal` cadastrada no perfil do usuário.
- Os protótipos visuais foram feitos **direto em HTML** (`prototipo/index.html`) e servem de referência para as telas em React. O PDF v3.3 cita "protótipos Figma"; essa etapa foi substituída pelo protótipo HTML (ver ADR-007).

## 6. Critérios do piloto do agente de IA
Avaliados ao fim da R6. Para o agente **permanecer**, todos precisam ser atendidos:
1. 8 de 10 perguntas de teste respondidas corretamente.
2. Mediana de tempo de resposta de até 5 s.
3. Nenhuma falha por limite de API durante a demonstração.
4. Revisão confirmando que nenhum dado pessoal sai do sistema.

Se algum falhar, o agente é **removido** e o escopo volta ao MVP.

## 7. Riscos
| Risco | Mitigação |
|---|---|
| Dois bancos aumentam a complexidade | R1 usa só MySQL; o MongoDB entra na R2 |
| Domínio de e-mail do Resend não verificado | Plano B em desenvolvimento: mostrar o código 2FA no log do servidor |
| Categorias próprias quebram o orçamento | O orçamento sempre usa o **grupo**, nunca a categoria |
| R5 carregada | RF11 (recorrências) e RF21–RF22 são os primeiros a serem cortados |
| Limite ou queda da API de IA | Reserva OpenRouter e, depois, mensagem fixa (agente atrás de flag) |
| IA inventar resposta | Código decide, IA só escreve; critério de 8/10 no piloto |
| Privacidade dos dados | Só dados agregados, sem nome, e-mail ou descrições, vão para a IA |
| Tempo curto | Backlog priorizado; MVP fecha na R5 |

## 8. Pendências de IHC (do estudo A02)
- O estudo usou 10 participantes **simulados por agentes de IA** (Playwright), não usuários reais: sucesso de 92,7% (102 de 110 tarefas), SUS médio 71,3, tempo de resposta mediano de 277 ms.
- Menu "Mais" com 9 itens no celular e cabeçalho fixo ocupando muito espaço com zoom de 200% precisam de revisão.
- Faltam tutorial, modo simples, auditoria WCAG e teste com leitor de tela.
