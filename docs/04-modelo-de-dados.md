# 04 · Modelo de dados

> Legenda: **[PDF]** vem do escopo v3.3; **[proposta]** foi sugerido na R0 parte 3 e vale depois da revisão do PR. Em caso de dúvida, o ADR correspondente em `07-roadmap.md` decide.

## 1. Visão geral: dois bancos
| Banco | Guarda | Por quê |
|---|---|---|
| **MySQL** (Sequelize) | `usuarios`, `codigos_2fa` | Dados relacionais, com integridade e chave estrangeira (conta e segurança). |
| **MongoDB** (Mongoose) | `transacoes`, `recorrencias`, `categorias`, `orcamentos`, `metas`, `historico_acoes`, `logs_analise` | Dados financeiros de uso intenso, com campos flexíveis. |

O vínculo `usuarioId` (Mongo) → `usuarios.id` (MySQL) é **lógico**: não existe chave estrangeira entre bancos. Por isso, toda consulta no Mongo filtra por `usuarioId` vindo do token, e a exclusão de uma conta precisa apagar os documentos do usuário no Mongo pela aplicação.

**Cronograma:** a R1 usa só MySQL; o MongoDB entra na R2 (reduz o risco de dois bancos).

## 2. MySQL

### 2.1 `usuarios` [PDF]
| Campo | Tipo | Regra |
|---|---|---|
| `id` | INT, PK, auto incremento | |
| `nome` | VARCHAR(120) | obrigatório |
| `email` | VARCHAR(160) | **único**, obrigatório |
| `senha_hash` | VARCHAR(100) | bcrypt; a senha nunca é guardada |
| `renda_mensal` | DECIMAL(12,2) | ≥ 0; base do 50/30/20 |
| `periodo_comparacao_padrao` | ENUM(`MES_ANTERIOR`, `TRIMESTRE`, `SEMESTRE`) | padrão `MES_ANTERIOR` |
| `criado_em` | DATETIME | |
| `atualizado_em` | DATETIME | |

### 2.2 `codigos_2fa` [PDF]
| Campo | Tipo | Regra |
|---|---|---|
| `id` | INT, PK | |
| `usuario_id` | INT, FK → `usuarios.id` | `ON DELETE CASCADE` |
| `codigo_hash` | VARCHAR(100) | o código de 6 dígitos é guardado só com **hash** |
| `expira_em` | DATETIME | criação + 10 minutos |
| `utilizado` | BOOLEAN | uso único |
| `tentativas` | TINYINT | máximo 5 |
| `criado_em` | DATETIME | |

Tamanhos de VARCHAR e a ordem das colunas são **[proposta]**. As migrations (ferramenta a definir em ADR) criam as tabelas; o `sync` automático do Sequelize não é usado em produção local.

## 3. MongoDB

Todos os documentos têm `usuarioId` (número, vindo de `usuarios.id`), exceto `categorias` padrão do sistema. Timestamps `createdAt`/`updatedAt` automáticos do Mongoose [proposta].

### 3.1 `transacoes` [PDF]
| Campo | Tipo | Regra |
|---|---|---|
| `usuarioId` | Number | obrigatório, indexado |
| `tipo` | String | `RECEITA` ou `DESPESA`; derivado da categoria |
| `grupo` | String | `NECESSIDADES`, `LAZER` ou `INVESTIMENTOS` (só despesas); derivado da categoria |
| `categoria` | String | nome da categoria |
| `descricao` | String | texto livre (opcional) |
| `valor` | Decimal128 | > 0 |
| `data` | Date | data do lançamento |
| `dataPrevista` | Date | só para transação prevista [proposta: opcional] |
| `confirmada` | Boolean | `false` até confirmar (RF08) |
| `recorrenciaId` | ObjectId | liga ao modelo que gerou o lançamento |

Índices [proposta]: `{ usuarioId, data }` para listagem e dashboard; `{ usuarioId, recorrenciaId, competencia }` único e parcial para impedir duplicidade de recorrência (RN09).

### 3.2 `recorrencias` [PDF]
`usuarioId`, `tipo`, `grupo`, `categoria`, `descricao`, `valor` (Decimal128), `diaDoMes`, `ativa` [proposta], `ultimaCompetencia` (string `AAAA-MM`). O job diário usa `ultimaCompetencia` para ser idempotente. Reativar uma recorrência pausada **não** gera os meses em que ela ficou pausada [proposta].

### 3.3 `categorias` [PDF]
`nome`, `tipo`, `grupo`, `usuarioId`. **`usuarioId` nulo = categoria padrão do sistema** (não pode ser excluída). Categorias próprias têm `usuarioId` preenchido. Índice único `{ usuarioId, nome }` [proposta]. As categorias padrão (lista em `02-requisitos.md` §4) entram por script de seed.

### 3.4 `orcamentos` [PDF]
`usuarioId`, `grupo`, `mesReferencia` (`AAAA-MM`), `percentual`, `limiteValor`. **Índice único** `{ usuarioId, grupo, mesReferencia }`. Os três percentuais do mês somam 100%. `limiteValor` = renda × percentual no momento do salvamento.

### 3.5 `metas` [PDF]
`usuarioId`, `nome`, `valorAlvo`, `valorAtual`, `prazo` [proposta], `aportes[]` (cada aporte com `valor` e `data`) [proposta].

### 3.6 `historico_acoes` [PDF]
`usuarioId`, `acao` (ex.: `LOGIN`, `TRANSACAO_CRIADA`, `IA_PERGUNTA`), `detalhes` (sem dados sensíveis) [proposta], `criadoEm`. A ação `IA_PERGUNTA` registra **só que** houve pergunta, nunca o conteúdo da conversa.

### 3.7 `logs_analise` [PDF]
Registro das análises por regras geradas para o usuário (período comparado e achados), usado pela tela de análise e para auditoria. Campos exatos [proposta]: `usuarioId`, `periodo`, `achados[]`, `criadoEm`.

## 4. Regras de integridade (resumo)
- Dinheiro: `DECIMAL(12,2)` no MySQL e `Decimal128` no Mongo; nunca ponto flutuante em cálculo.
- Dado de outro usuário responde 404, igual a inexistente.
- Tipo e grupo vêm sempre da categoria; o cliente não os envia.
- Exclusão de conta: apaga `codigos_2fa` por cascata e os documentos do Mongo por rotina da aplicação [proposta, detalhar na R1].

## 5. Pendências para decidir em ADR
- Migrations do MySQL: **Sequelize CLI** (ADR-020), configurado na R0 parte 7. O MongoDB roda em Docker e o MySQL é o local do Windows (ADR-018).
- Estratégia de seed das categorias padrão (script idempotente).
- Política de exclusão de conta (existe no MVP ou fica fora?).
