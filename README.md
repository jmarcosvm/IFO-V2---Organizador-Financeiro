# IFO V2 – Inteligência Financeira Organizada

Organizador financeiro pessoal para o brasileiro médio: registra receitas e despesas, divide a renda pela regra **50/30/20** (necessidades, lazer, investimentos), avisa antes de o limite estourar e mostra para onde o dinheiro foi.

Projeto acadêmico da **FATEC Cotia** (Desenvolvimento de Software Multiplataforma, 2º semestre de 2026). O IFO V2 é a evolução do IFO V1 (Java + Spring Boot + PostgreSQL), desenvolvido no semestre anterior.

> **Estado atual, sem rodeios:** este repositório contém hoje **o escopo, o logotipo e um protótipo de interface** (um único arquivo HTML com dados fictícios). **Não existe back-end, banco de dados nem o front-end em React ainda.** Nada do que se faz no protótipo é salvo: ao recarregar a página, os dados voltam ao início.

## Sumário

- [O que há no repositório](#o-que-há-no-repositório)
- [Como rodar o protótipo](#como-rodar-o-protótipo)
- [O que o protótipo faz (e o que é de mentira)](#o-que-o-protótipo-faz-e-o-que-é-de-mentira)
- [Stack planejada](#stack-planejada-ainda-não-implementada)
- [Escopo e plano de sprints](#escopo-e-plano-de-sprints)
- [Estudo de IHC](#estudo-de-ihc)
- [Limitações conhecidas](#limitações-conhecidas)
- [Equipe](#equipe)
- [Licença](#licença)

## O que há no repositório

| Caminho | Conteúdo |
|---|---|
| `docs/Escopo_IFO_V2.pdf` | Documento de escopo (v3.3): requisitos RF01–RF25, stack, decisões técnicas, modelo de dados, sprints e riscos |
| `Logo/` | Logotipo original do grupo (imagem). A versão vetorial (SVG) usada no protótipo está embutida em `prototipo/index.html` |
| `prototipo/index.html` | Protótipo navegável da interface (HTML + CSS + JavaScript, sem build) |

## Como rodar o protótipo

Não há instalação. Abra o arquivo no navegador:

```powershell
start prototipo\index.html
```

(ou dê um duplo clique em `prototipo/index.html`).

- **Precisa de internet:** a fonte (Google Fonts) e a biblioteca de gráficos (Chart.js, via CDN) são carregadas online. Sem conexão, a página funciona, mas sem os gráficos e com a fonte do sistema.
- **Acesso de demonstração:** e-mail `demo@ifo.teste`, senha `demo12345`. O botão **Preencher** na tela de login preenche isso por você.
- **Código de verificação (2FA):** `123456`. Ele aparece escrito na própria tela porque nenhum e-mail é enviado.
- **Data "hoje" no protótipo:** fixa em 11/11/2026, para os dados de exemplo fazerem sentido.
- Navegadores testados: Chromium (Playwright). Não foi testado em Safari nem em Firefox.

## O que o protótipo faz (e o que é de mentira)

Telas e fluxos implementados na interface:

- **Acesso:** cadastro, login e verificação em duas etapas (código de 6 dígitos, validade de 10 minutos, 5 tentativas, reenvio), logout.
- **Painel:** saldo, receitas e despesas; seletor de período (mês, trimestre, semestre, ano); anel do 50/30/20; gráficos de pizza, linha e barras; clicar numa fatia, barra ou linha de grupo abre as transações já filtradas.
- **Transações:** criar, editar, excluir (com "Desfazer"), filtros, transação **prevista** com confirmação, grupo preenchido pela categoria, categorias próprias, **exportação CSV** (separador `;`, UTF-8 com BOM, proteção contra injeção de fórmula).
- **Recorrências:** criar, editar, pausar, retomar e excluir despesas mensais; gera os meses que ficaram para trás sem duplicar.
- **Orçamentos:** percentuais editáveis por mês (soma exatamente 100%), com pré-visualização do efeito sobre o gasto atual; o mês novo herda o anterior.
- **Alertas:** aviso a partir de 80% e acima de 100% do limite; só informa, nunca bloqueia o lançamento.
- **Metas:** criar, editar, excluir e registrar aportes, com o valor mensal necessário.
- **Simulador de investimentos:** juros simples e compostos, aplicação única e/ou aporte mensal, gráfico e tabela mês a mês (cálculo real, feito no navegador).
- **Análise:** comparação com o período anterior, sugestão de economia e projeção do saldo.
- **Atividades, Perfil e Assistente.**
- **Tema claro e escuro** (segue o sistema; a escolha fica no `localStorage`), atalho `N` para nova transação, aviso sonoro/vibração opcional, layout responsivo até 360 px.

O que **é simulado** (não confunda com funcionalidade real):

| Item | Na prática |
|---|---|
| Login e 2FA | Comparação fixa no JavaScript; nenhum e-mail é enviado e não há senha com hash |
| Dados | Gerados no próprio arquivo; reiniciam a cada recarga |
| Assistente (piloto) | Respostas montadas por **regras simples em JavaScript** sobre os dados de exemplo. **Não chama nenhum modelo de IA** |
| Atraso de carregamento | Spinners e esperas são artificiais, para testar o feedback da interface |
| "Painel do protótipo" (menu) | Ferramenta de teste: simula falha do assistente, carregamento lento, limpa ou restaura os dados. Não existirá no produto final |

## Stack planejada (ainda não implementada)

Conforme o escopo:

| Camada | Tecnologia |
|---|---|
| Back-end | Node.js + Express (MVC: routes → controllers → services → models) |
| Bancos | MySQL + Sequelize (usuários, códigos 2FA) e MongoDB + Mongoose (transações, orçamentos, metas, recorrências, histórico) |
| Front-end | React (Vite) + Tailwind CSS |
| Gráficos | Chart.js (react-chartjs-2) |
| 2FA | Resend (e-mail) |
| Recorrências | `node-cron`, job diário idempotente |
| Agente de IA (piloto) | Google AI Studio (Gemini), reserva OpenRouter; só dados agregados; limite de 20 perguntas/dia; só permanece se atingir os critérios do escopo |
| Entrega | Ambiente local, sem deploy em nuvem |

O protótipo **não usa nenhuma dessas tecnologias**: é HTML/CSS/JS puro para validar a interface antes de programar em React.

## Escopo e plano de sprints

O escopo completo está em `docs/Escopo_IFO_V2.pdf`. Resumo do plano:

| Sprint | Entrega | Requisitos |
|---|---|---|
| 0 | Setup (repositório, bancos locais, estrutura MVC, Vite/React/Tailwind), protótipos das telas principais | — |
| 1 | Cadastro, login, 2FA por e-mail, logout e edição de perfil | RF01–RF04 |
| 2 | Categorias, CRUD de transações (inclui prevista), filtros e exportação CSV | RF05–RF10 |
| 3 | Dashboard interativo (seletor de período e clique nos gráficos), gráficos Chart.js e painel 50/30/20 | RF12–RF14 |
| 4 | Orçamento por percentuais com alertas, metas com aportes e simulador | RF15–RF18 |
| 5 | Despesas recorrentes, dark mode, análise inteligente, histórico, polimento de UI e testes finais do MVP | RF11 e RF19–RF22 |
| 6 | Agente de IA (piloto): chat, contexto agregado, limites, avaliação e decisão de manter ou remover | RF23–RF25 |

> O protótipo cobre a **interface** de quase todos os requisitos, mas **nenhum requisito está implementado de verdade** (regras de negócio no servidor, persistência, segurança). Se o PDF for atualizado, ele é a fonte da verdade; esta tabela é só um resumo.

Fora do escopo: aplicativo mobile, Open Finance/importação de extrato, treinar modelos próprios, IA que altera dados, deploy em produção, notificações push/SMS, perfil familiar e exportação em PDF.

## Estudo de IHC

O protótipo foi avaliado na atividade A02 de Interação Humano-Computador (métricas de usabilidade, avaliação heurística de Nielsen, signo visual com inspeção semiótica e affordance).

**Como ler os números com honestidade:** não houve usuários reais no prazo. O teste foi feito com **10 participantes simulados** (agentes de IA instruídos com perfis de usuários comuns), que navegaram no protótipo com um navegador automatizado. Por isso:

- os resultados são **exploratórios** e não substituem um teste com pessoas reais;
- o **tempo de resposta** foi cronometrado por script; os **tempos de tarefa e de aprendizado** são estimativas de ritmo de cada perfil;
- a amostra (10) revela bem problemas graves, mas não permite estimativas estatísticas.

Resultados principais: taxa de sucesso de 92,7% (102 de 110 tarefas), nota SUS média de 71,3, tempo de resposta mediano de 277 ms. O problema mais grave (severidade 4) foi dois botões ocultos em telas estreitas, já corrigido e verificado por script. Os problemas encontrados levaram a correções no protótipo (affordances nos gráficos, legenda do anel, pré-visualização de orçamento, entre outras).

O trabalho escrito e a apresentação do estudo **não estão neste repositório**. O protocolo (11 tarefas, 5 perguntas de compreensão e escala SUS) pode ser repetido com usuários reais, o que é o próximo passo recomendado.

## Limitações conhecidas

- Sem back-end, banco ou autenticação reais; nenhum dado é persistido.
- Depende de CDN (Google Fonts e Chart.js) para visual e gráficos completos.
- Pendências de IHC: menu "Mais" com 9 itens no celular, cabeçalho e barra fixos ocupam muito espaço com zoom de 200%, falta ajuda contextual/tutorial e um modo simples do painel.
- O campo de data usa o componente nativo do navegador (o formato exibido depende do idioma do navegador); o protótipo mostra a data escolhida em dia/mês/ano logo abaixo.
- A exportação CSV inclui transações previstas sem coluna de status, como definido no escopo.
- Não há testes automatizados do código do protótipo; a verificação foi feita com scripts de navegador (Playwright) fora deste repositório.
- Acessibilidade: foco visível, rótulos e contraste foram cuidados, mas **não houve auditoria formal** (WCAG) nem teste com leitor de tela.

## Equipe

- João Marcos Vilaça Marques
- Lucas de Souza Saldanha dos Santos
- Amanda Freitas de Lima
- Vinicius de Amorim Farias
- Jetro Pereira

## Licença

A definir pela equipe. Enquanto não houver um arquivo `LICENSE`, todos os direitos ficam reservados aos autores.
