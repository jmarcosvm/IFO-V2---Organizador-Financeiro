# 08 · Lições da V1 (e do MFA)

> O que o IFO V1 e o projeto MFA ensinaram e que o IFO V2 **não deve repetir**. Fontes: `docs/08-diagnostico-v1.md` do IFO V1, `CLAUDE.md` do V1 e do MFA. Use como checklist ao planejar cada sprint.

## 1. Diagnóstico da V1 (resumo)
O V1 original tinha problemas em seis frentes, que a refatoração (R0–R6 do V1) corrigiu:

| Frente | O que deu errado na V1 original | Regra para a V2 |
|---|---|---|
| **S** · Segurança | Senha em texto puro, API devolvendo a senha, usuário escolhido por `?usuario=ID`, `CORS *`, credenciais no repositório, XSS | bcrypt desde a R1; usuário **sempre do token**; CORS restrito; `.env` fora do Git; nunca `innerHTML` com dado do usuário |
| **B** · Banco | Entidade e tabela divergentes, `ALTER` manual no banco | Esquema só muda por **migration** versionada (ADR de migrations na R0) |
| **N** · Negócio | Regras espalhadas e inconsistentes (tipo/grupo escolhidos à mão) | Tipo e grupo **derivados da categoria**; regra só no `services/` |
| **A** · API | Editar via DELETE + POST; formatos de erro diferentes | PUT/PATCH de verdade; **um** formato de erro (`05-api.md` §2) |
| **F** · Frontend | `app.js` com ~800 linhas misturando tudo | Componentes pequenos, um cliente HTTP único, sem regra no front |
| **T** · Testes | Testes comparavam com senha fixa; quase nada cobria regra de negócio | Teste de regra com bordas e de isolamento entre usuários desde a primeira sprint |

## 2. Lições de processo
- **Documentar antes de codar.** A refatoração do V1 só andou depois da R0 de documentação. Aqui, as partes de R0 são só docs.
- **Partes pequenas.** A V1 dividiu sprints grandes em 4–5 partes (um PR por parte) e isso facilitou a revisão. Mantemos: uma parte = uma branch = um PR.
- **Doc muda com o código.** Quando o contrato muda, atualizar `docs/` **na mesma parte**; senão a doc vira mentira.
- **Decisão nova vira ADR.** Item novo só entra na sprint com decisão registrada.
- **Só se diz "pronto" com evidência.** Suíte verde **com o número de testes**; "deu bom" sem saída de teste não fecha parte (aprendizado do MFA).
- **Riscos aceitos vão por escrito.** O V1 registrou o que ficou sem tratar (ex.: sem limite de login, token sem revogação). Faremos o mesmo em ADR.
- **Conferir `git status` antes de commitar.** No V1 o editor trocou a versão do Java em três arquivos sem ninguém pedir; o `git restore <arquivo>` resolve.

## 3. Lições de IA (MFA)
- **O código decide, a IA escreve.** A IA nunca altera números calculados; se falhar, o app segue com mensagem fixa.
- **Dependência: avisar antes de adicionar ou trocar.** No MFA uma troca de biblioteca de HTTP passou sem aviso claro, e uma biblioteca de IA (LiteLLM) foi descartada por risco de cadeia de suprimentos.
- **Chaves só em header e em variável de ambiente.** Erros do provedor nunca vão ao usuário com o corpo da resposta.
- **Privacidade do plano gratuito.** Provedores gratuitos podem usar os dados; por isso só dados **agregados** saem do sistema.
- **Texto de IA não tem checagem automática dos números citados.** Declarar essa limitação e manter o aviso "não é recomendação financeira".

## 4. Armadilhas do ambiente (Windows 11)
- Rodar Maven/Node pelo **PowerShell**; o Git Bash falha com erros de `fork` em comandos longos.
- Caminhos têm acento e espaço (`IFO V2- Inteligência Financeira Organizada`): **sempre entre aspas**.
- Quebra de linha: o Git avisa "LF will be replaced by CRLF". É normal, mas arquivos que já usam CRLF devem continuar com CRLF.
- Python pode não estar disponível no PATH (no MFA é preciso chamar o `python` da `.venv`); os scripts do IFO V2 devem ser em Node ou shell, sem depender dele.
- Sem Docker ligado, os bancos locais não sobem; conferir antes de culpar o código.

## 5. O que a V1 acertou e vamos manter
- Tabela de ADRs com número sequencial e motivo.
- Alerta de orçamento só informa, nunca bloqueia.
- Dado de outro usuário responde 404 (igual a inexistente).
- CSV com `;`, BOM e proteção contra injeção de fórmula.
- Frontend só exibe; regra e dinheiro no backend.
