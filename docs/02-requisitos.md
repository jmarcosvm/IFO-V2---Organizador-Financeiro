# 02 · Requisitos

> Prioridades: **MVP** (obrigatório), **Desej.** (desejável, cortável) e **Piloto** (agente de IA, sujeito aos critérios do `01-escopo.md` §6). A coluna "Sprint" segue o plano do `07-roadmap.md`.

## 1. Requisitos funcionais

| ID | Requisito | Prioridade | Sprint |
|---|---|---|---|
| RF01 | **Cadastro:** nome, e-mail único, senha com no mínimo 8 caracteres (bcrypt) e renda mensal ≥ 0. O novo usuário recebe o orçamento padrão 50/30/20. | MVP | R1 |
| RF02 | **Login com 2FA:** após e-mail e senha, código de 6 dígitos enviado por e-mail (Resend). Vale 10 minutos, uso único, 5 tentativas. | MVP | R1 |
| RF03 | **Sessão:** JWT em cookie httpOnly (SameSite=Lax). Logout apaga o cookie. | MVP | R1 |
| RF04 | **Perfil:** editar nome, renda mensal e `periodo_comparacao_padrao`. | MVP | R1 |
| RF05 | **Transações:** criar, listar, editar e excluir receitas e despesas. | MVP | R2 |
| RF06 | **Grupo derivado:** o grupo (Necessidades, Lazer, Investimentos) vem da categoria escolhida. | MVP | R2 |
| RF07 | **Categorias próprias:** o usuário cria categorias; as padrão não podem ser excluídas. | MVP | R2 |
| RF08 | **Transação prevista:** lançamento com `dataPrevista` e confirmação posterior. | MVP | R2 |
| RF09 | **Filtros:** por período, tipo, grupo, categoria e texto. | MVP | R2 |
| RF10 | **Exportar CSV** (formato na §3). | MVP | R2 |
| RF11 | **Recorrências:** modelo mensal que gera transações por job diário idempotente, com recuperação de meses perdidos. | Desej. | R5 |
| RF12 | **Dashboard:** seletor de período (mês, trimestre, semestre, ano) e totais. | MVP | R3 |
| RF13 | **Gráficos:** pizza, linha e barras, clicáveis (drill-down). | MVP | R3 |
| RF14 | **Painel 50/30/20:** real versus meta por grupo. | MVP | R3 |
| RF15 | **Orçamento:** percentuais por grupo somando 100%; limite = renda × percentual; mês novo herda o anterior. | MVP | R4 |
| RF16 | **Alertas de orçamento:** atenção a partir de 80%, estouro acima de 100%. Nunca bloqueia o lançamento. | MVP | R4 |
| RF17 | **Metas:** criar metas e registrar aportes. | MVP | R4 |
| RF18 | **Simulador de investimentos:** sem persistência, cálculo no cliente. | MVP | R4 |
| RF19 | **Dark mode** com escolha salva no navegador. | MVP | R5 |
| RF20 | **Análise por regras:** comparação com o período anterior. | MVP | R5 |
| RF21 | **Sugestão de economia e projeção** do fim do mês. | Desej. | R5 |
| RF22 | **Histórico de ações** do usuário. | Desej. | R5 |
| RF23 | **Chat com agente de IA** (somente leitura). | Piloto | R6 |
| RF24 | **Contexto da IA** só com dados agregados (sem nome, e-mail nem descrições). | Piloto | R6 |
| RF25 | **Limite e avaliação:** 20 perguntas por usuário por dia; resposta avaliável como positiva ou negativa. | Piloto | R6 |

## 2. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RNF01 | Segurança | Senha com bcrypt; código 2FA guardado com **hash**; JWT stateless; segredos só em variáveis de ambiente. |
| RNF02 | Segurança | Cada usuário acessa só os próprios dados; recurso de outro usuário responde como inexistente (404). |
| RNF03 | Usabilidade | Cada tela tem referência no protótipo HTML antes de ser codada em React; feedback de carregamento, sucesso e erro em toda ação. |
| RNF04 | Exportação | CSV só com dados do usuário logado e com neutralização de injeção de fórmulas. |
| RNF05 | Recorrência | Geração idempotente: rodar o job duas vezes na mesma competência não duplica lançamentos. |
| RNF06 | Responsividade | Funcionar em telas de 360 px de largura. |
| RNF07 | Arquitetura | MVC em camadas `routes → controllers → services → models`, com validação de entrada em todas as rotas. |
| RNF08 | Desempenho | API abaixo de 1 s em ambiente local, com até 5 mil transações por usuário. |
| RNF09 | Execução | Sobe localmente; o README explica MySQL, MongoDB, API e frontend. |
| RNF10 | Acessibilidade | Alvos de toque ≥ 40 px, contraste adequado nos dois temas e uso com zoom de 200%. |

## 3. Regras de negócio

| ID | Regra |
|---|---|
| RN01 | Cada usuário nasce com orçamento padrão 50% Necessidades, 30% Lazer e 20% Investimentos. |
| RN02 | O **grupo** de uma despesa é derivado da categoria; o tipo (receita ou despesa) também. |
| RN03 | A base do 50/30/20 é a `renda_mensal` do usuário. Limite do grupo = renda × percentual. |
| RN04 | Os percentuais do orçamento devem somar **100%**. Um mês novo herda o orçamento do anterior. |
| RN05 | Nível de alerta por grupo: **OK** abaixo de 80%; **ATENÇÃO** de 80% a 100%; **ESTOURO** acima de 100%. O alerta nunca bloqueia o lançamento. |
| RN06 | O orçamento é sempre por **grupo**, nunca por categoria (categorias próprias não quebram o orçamento). |
| RN07 | Categorias padrão do sistema não podem ser excluídas; categorias próprias pertencem ao usuário. |
| RN08 | Transação prevista só entra nos totais realizados depois de confirmada. |
| RN09 | Recorrência gera no máximo **uma** transação por competência (`AAAA-MM`). Meses perdidos são recuperados na próxima execução do job. |
| RN10 | Código 2FA: 6 dígitos, validade de 10 minutos, uso único, máximo de 5 tentativas. |
| RN11 | O agente de IA é somente leitura, envia só dados agregados e respeita 20 perguntas por usuário por dia e 15 s por resposta. |
| RN12 | Dinheiro é guardado como `Decimal128` (Mongo) e nunca em ponto flutuante; arredonda-se só no resultado final. |

### Formato do CSV (RF10)
`Data;Tipo;Grupo;Categoria;Descrição;Valor`
- separador `;`, vírgula decimal, datas `dd/MM/aaaa`, UTF-8 **com BOM**;
- texto que começa com `=`, `+`, `-` ou `@` ganha apóstrofo no início (anti-injeção de fórmula);
- exporta apenas dados do usuário logado.

## 4. Modelo de despesa: Grupo → Categoria → Descrição

**Necessidades (50%):** Moradia, Contas fixas, Alimentação (mercado), Transporte, Saúde, Educação, Parcelas/Dívidas.
**Lazer (30%):** Delivery, Passeio, Assinaturas, Compras/Vestuário, Viagem, Outros.
**Investimentos (20%):** Renda fixa, Renda variável, Reserva de emergência, Previdência.
**Receitas (lista sem grupo):** Salário, Freelance, Rendimentos, Mesada/Presente, Reembolso, Outros.

Diferença em relação à V1: aqui o usuário pode criar categorias próprias, e as padrão não podem ser excluídas.

## 5. Rastreabilidade por sprint

| Sprint | Requisitos |
|---|---|
| R0 | — (documentação e setup) |
| R1 | RF01, RF02, RF03, RF04 |
| R2 | RF05, RF06, RF07, RF08, RF09, RF10 |
| R3 | RF12, RF13, RF14 |
| R4 | RF15, RF16, RF17, RF18 |
| R5 | RF11, RF19, RF20, RF21, RF22 |
| R6 | RF23, RF24, RF25 |

Todos os 25 requisitos estão mapeados. Em caso de aperto na R5, cortar primeiro RF11, RF21 e RF22.
