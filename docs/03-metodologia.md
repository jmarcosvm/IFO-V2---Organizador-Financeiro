# 03 · Metodologia

## 1. Gestão ágil (Scrum leve)
- O trabalho é dividido em **sprints R0 a R6** (código "R"; ver `07-roadmap.md`). A R0 é de preparação, sem funcionalidades.
- Cada sprint é quebrada em **partes pequenas** ("R2 parte 3"). **Uma parte = uma branch = um PR.**
- Backlog e quadro no **GitHub Projects**. Cada item do roadmap vira um cartão ligado ao PR que o entrega.
- Antes de iniciar uma sprint: plano em partes, com branch, objetivo, arquivos prováveis, como testar e critério de pronto.
- Ao fim de cada sprint: revisão do que foi entregue, ajuste do roadmap e registro de decisões novas como ADR.

## 2. Definition of Ready (pronto para começar)
Um item só entra na sprint quando:
1. está ligado a um requisito (RF/RNF) ou a uma decisão registrada em ADR;
2. tem critério de pronto claro e forma de testar;
3. se envolver tela, ela já existe no protótipo HTML (`prototipo/index.html`);
4. as dependências (outras partes, contas, chaves de API) estão resolvidas.

## 3. Definition of Done (pronto para fechar)
Uma parte está pronta quando:
1. funciona **ponta a ponta** (da tela ao banco, quando houver);
2. a suíte completa de testes está **verde**, com o número de testes informado;
3. foi **revisada por outro membro** da equipe via PR;
4. está na branch `main`;
5. a documentação em `docs/` foi atualizada na **mesma parte** (a doc é a fonte da verdade);
6. o item foi marcado no `07-roadmap.md`.

## 4. Fluxo de Git
Branch principal: **`main`**. Nunca se trabalha direto nela.

1. `git switch main` → `git pull` → `git status` (deve estar limpo).
2. `git switch -c feature/<sprint>-<assunto>` (ex.: `feature/r1-cadastro-login`).
3. Codificar, testar e conferir o `git status`.
4. `git add <arquivos>` → `git commit -m "<tipo>: <título>" -m "<atribuição>"`.
5. `git push -u origin <branch>` → abrir PR → revisão → merge.
6. `git switch main` → `git pull` → `git branch -d <branch>`.

Regras: nada de `--no-verify`, `push --force` ou `reset --hard` sem decisão explícita. Segredos nunca entram no Git.

### Nome das branches
`feature/<sprint em minúsculo>-<assunto-em-kebab-case>`, em português e sem acento. O assunto descreve a entrega, não o dia nem o autor. Trabalho fora de sprint usa `feature/docs-<assunto>` ou `fix/<assunto>`.

### Commits (Conventional Commits)
| Tipo | Quando usar |
|---|---|
| `feat` | funcionalidade nova ou mudança visível de comportamento |
| `fix` | correção de bug |
| `docs` | só documentação |
| `test` | testes novos ou alterados |
| `refactor` | reorganiza o código sem mudar o comportamento |
| `chore` | configuração, dependências, build |

Título em português, imperativo e curto; **um commit por assunto**. Título do PR com a parte no fim: `feat: ... (R2 parte 3)`.

## 5. Níveis de teste
| Nível | O que cobre | Ferramenta |
|---|---|---|
| Unitário | Regras de negócio puras (limites de orçamento, alertas, CSV, recorrência) com casos felizes e bordas (79,9% / 80% / 100% / 100,01%) | Vitest (ADR-016) |
| Integração | Rotas da API (sem subir servidor) e, a partir da parte 7 da R0, contra MySQL e MongoDB de teste, incluindo isolamento entre usuários (404 para dado alheio) | Vitest + Supertest (ADR-016) |
| Manual / IHC | Telas em 360 px, tema claro e escuro, teclado e leitor de tela | Checklist por sprint |

Regra: toda regra nova leva teste. Testes que dependem da data de "hoje" recebem a data por parâmetro.

## 6. Documentação como código
- `docs/*.md` é versionada junto com o código e muda **na mesma parte** que o código.
- Decisão nova de arquitetura vira **ADR** com número sequencial na tabela do `07-roadmap.md`. Item novo só entra na sprint com decisão registrada.
- Diagramas ficam versionados (Mermaid) em `docs/`.

## 7. Uso de IA no desenvolvimento
O Claude Code escreve código e documentação, roda os testes e instrui o Git. Ele nunca decide sozinho uma decisão de arquitetura, nunca adiciona ou troca dependência sem avisar e nunca afirma "pronto" sem a suíte verde. Combinados completos no `CLAUDE.md`.
