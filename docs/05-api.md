# 05 · API

> **Todo este contrato é [proposta]**: o PDF define os requisitos, mas não os endpoints. Os nomes abaixo valem depois da revisão do PR e podem ser refinados dentro da sprint em que cada rota nasce (atualizando este arquivo na mesma parte).

## 1. Convenções
- Prefixo `/api`. JSON em UTF-8. Textos e mensagens em português.
- Autenticação: JWT em **cookie httpOnly** (SameSite=Lax). Rotas marcadas com 🔒 exigem cookie válido.
- O usuário vem **sempre do token**, nunca de parâmetro. Recurso de outro usuário responde **404**.
- Dinheiro trafega como string decimal (`"1234.56"`) para não perder precisão.
- Datas em ISO `AAAA-MM-DD`; competências em `AAAA-MM`.
- Toda rota valida a entrada (corpo, query e params) antes de chegar ao service.

## 2. Formato de erro
```json
{
  "erro": {
    "codigo": "VALIDACAO",
    "mensagem": "Senha deve ter no mínimo 8 caracteres.",
    "campos": { "senha": "mínimo de 8 caracteres" }
  }
}
```
| HTTP | `codigo` | Quando |
|---|---|---|
| 400 | `VALIDACAO` | entrada inválida ou regra de negócio violada |
| 401 | `NAO_AUTENTICADO` | sem cookie, expirado ou 2FA inválido |
| 404 | `NAO_ENCONTRADO` | inexistente **ou de outro usuário** |
| 409 | `CONFLITO` | e-mail já cadastrado, competência já gerada |
| 429 | `LIMITE_EXCEDIDO` | tentativas de 2FA ou perguntas da IA no dia |
| 500 | `ERRO_INTERNO` | falha inesperada, sem detalhes internos |

Mensagens de erro nunca expõem stack trace, SQL ou corpo de resposta de provedor externo.

## 3. Endpoints por sprint

### R1 · Conta e sessão
| Método | Rota | Descrição | RF |
|---|---|---|---|
| POST | `/api/auth/cadastro` | cria usuário e orçamento padrão 50/30/20 | RF01 |
| POST | `/api/auth/login` | valida e-mail e senha e envia código 2FA | RF02 |
| POST | `/api/auth/verificar-2fa` | confere o código e emite o cookie JWT | RF02, RF03 |
| POST | `/api/auth/logout` 🔒 | apaga o cookie | RF03 |
| GET | `/api/perfil` 🔒 | dados do usuário logado | RF04 |
| PUT | `/api/perfil` 🔒 | edita nome, renda e período de comparação | RF04 |

### R2 · Categorias e transações
| Método | Rota | Descrição | RF |
|---|---|---|---|
| GET | `/api/categorias` 🔒 | padrão + próprias | RF07 |
| POST | `/api/categorias` 🔒 | cria categoria própria | RF07 |
| DELETE | `/api/categorias/:id` 🔒 | exclui própria (padrão → 400) | RF07 |
| GET | `/api/transacoes` 🔒 | lista com filtros (`de`, `ate`, `tipo`, `grupo`, `categoria`, `q`) | RF05, RF09 |
| POST | `/api/transacoes` 🔒 | cria; devolve `{ transacao, alerta }` | RF05, RF06 |
| PUT | `/api/transacoes/:id` 🔒 | edita; devolve `{ transacao, alerta }` | RF05 |
| DELETE | `/api/transacoes/:id` 🔒 | exclui | RF05 |
| PATCH | `/api/transacoes/:id/confirmar` 🔒 | confirma transação prevista | RF08 |
| GET | `/api/transacoes/exportar.csv` 🔒 | CSV do período (formato em `02-requisitos.md` §3) | RF10 |

### R3 · Dashboard
| Método | Rota | Descrição | RF |
|---|---|---|---|
| GET | `/api/dashboard?periodo=MES&referencia=2026-11` 🔒 | totais, séries e gráficos do período | RF12, RF13 |
| GET | `/api/dashboard/grupos` 🔒 | real × meta 50/30/20 | RF14 |
| GET | `/api/dashboard/detalhe?grupo=&categoria=` 🔒 | drill-down | RF13 |

### R4 · Orçamento, metas e simulador
| Método | Rota | Descrição | RF |
|---|---|---|---|
| GET | `/api/orcamentos?mes=AAAA-MM` 🔒 | percentuais, limites e nível de alerta por grupo | RF15, RF16 |
| PUT | `/api/orcamentos?mes=AAAA-MM` 🔒 | salva percentuais (soma 100%) | RF15 |
| GET/POST | `/api/metas` 🔒 | lista e cria metas | RF17 |
| PUT/DELETE | `/api/metas/:id` 🔒 | edita e exclui | RF17 |
| POST | `/api/metas/:id/aportes` 🔒 | registra aporte | RF17 |

O simulador (RF18) é calculado **no cliente**, sem endpoint. O mesmo vale para o dark mode (RF19), que fica só no frontend (`localStorage`).

### R5 · Recorrências, análise e histórico
| Método | Rota | Descrição | RF |
|---|---|---|---|
| GET/POST | `/api/recorrencias` 🔒 | lista e cria modelos | RF11 |
| PUT/DELETE | `/api/recorrencias/:id` 🔒 | edita, pausa e exclui | RF11 |
| GET | `/api/analise?periodo=` 🔒 | análise por regras versus período anterior | RF20 |
| GET | `/api/analise/economia` 🔒 | sugestões e projeção do mês | RF21 |
| GET | `/api/historico` 🔒 | histórico de ações (paginado) | RF22 |

### R6 · Agente de IA (piloto)
| Método | Rota | Descrição | RF |
|---|---|---|---|
| POST | `/api/ia/perguntar` 🔒 | recebe `{ pergunta }`; o backend monta o contexto agregado (RF24); 404 se `AI_AGENT_ENABLED=false`; 429 após 20/dia | RF23, RF24, RF25 |
| POST | `/api/ia/avaliar` 🔒 | `{ avaliacao: "POSITIVA" \| "NEGATIVA" }` | RF25 |

### Saúde
`GET /api/saude` (sem login) devolve `{ "status": "ok" }` para conferir se a API e os bancos subiram.

## 4. Pendências
- Paginação padrão (`pagina`, `limite`) e limite máximo por página.
- Política de CORS e CSRF para cookie entre `localhost:5173` (front) e a API.
- Limite de tentativas de login por IP/e-mail (hoje só o 2FA tem limite).
