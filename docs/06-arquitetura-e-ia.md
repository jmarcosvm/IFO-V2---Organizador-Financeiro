# 06 · Arquitetura e IA

> Legenda: **[PDF]** vem do escopo v3.3; **[proposta]** é sugestão desta parte, a confirmar na revisão.

## 1. Visão geral
```
Navegador (React + Vite + Tailwind)
        │  HTTP/JSON + cookie httpOnly
        ▼
API Node.js + Express  ──►  MySQL  (usuários, códigos 2FA)
   │         │          └─►  MongoDB (transações, orçamentos, metas, ...)
   │         └─► Resend (e-mail do 2FA)
   └─► Provedor de IA (Gemini → OpenRouter → mensagem fixa)   [R6, atrás de flag]
```
Tudo roda **localmente** (sem deploy em nuvem) [PDF].

## 2. Camadas do backend (MVC) [PDF]
`routes → controllers → services → models`

| Camada | Responsabilidade | Não faz |
|---|---|---|
| `routes` | liga método+caminho ao controller e aplica middlewares (auth, validação) | regra de negócio |
| `controllers` | lê a requisição, chama o service, devolve a resposta HTTP | acessar o banco direto |
| `services` | **regras de negócio** (alertas, orçamento, recorrência, análise) | conhecer HTTP (`req`/`res`) |
| `models` | Sequelize (MySQL) e Mongoose (Mongo) | regra de negócio |

Pastas auxiliares [proposta]: `middlewares/` (auth, validação, erro), `jobs/` (node-cron), `config/` (ambiente, conexões), `utils/`. Tratamento de erro central: serviços lançam erros tipados e um middleware final os converte no formato de `05-api.md` §2.

## 3. Autenticação e segurança
- **Senha:** bcrypt; mínimo de 8 caracteres [PDF].
- **2FA:** após e-mail e senha corretos, gera código de 6 dígitos, guarda só o **hash**, vale 10 minutos, uso único, 5 tentativas [PDF]. O e-mail sai pelo **Resend**. Em desenvolvimento, se o domínio não estiver verificado, o código aparece no **log do servidor** (plano B do escopo).
- **Sessão:** JWT **stateless** em cookie httpOnly, SameSite=Lax; logout apaga o cookie; **sem tabela de sessões** [PDF]. Expiração do token e atributo `Secure` em ambiente local a definir em ADR [proposta].
- **Isolamento:** o `usuarioId` vem do token; toda consulta filtra por ele; recurso alheio devolve 404.
- **Segredos:** só em variáveis de ambiente; `.env` fora do Git, modelo em `.env.example`.
- **CSV:** neutraliza injeção de fórmula e só exporta dados do usuário logado.
- **Entrada:** toda rota valida corpo, query e params (biblioteca de validação a definir em ADR).

## 4. Jobs agendados [PDF]
- **Recorrências:** job diário (node-cron) lê `recorrencias` ativas e gera a transação da competência `AAAA-MM` quando o dia do mês chega. É **idempotente**: `ultimaCompetencia` e o índice único em `transacoes` impedem duplicar mesmo que o job rode duas vezes. Ao subir, o servidor também recupera competências perdidas enquanto estava desligado.
- Horário do job e fuso (`America/Sao_Paulo`) [proposta].

## 5. Frontend [PDF]
- React (Vite) + Tailwind CSS, **sem biblioteca de componentes**; gráficos com Chart.js (react-chartjs-2).
- Dark mode pela classe `dark` do Tailwind, escolha em `localStorage`.
- O front só **exibe e formata**; regras e dinheiro ficam no backend (o simulador é a exceção prevista, calculado no cliente).
- Referência visual: `prototipo/index.html`. Responsivo a partir de 360 px.
- Estrutura de pastas e roteamento (React Router) [proposta]: `paginas/`, `componentes/`, `servicos/` (cliente HTTP único), `hooks/`, `contextos/`.

## 6. Agente de IA (piloto, R6)

### 6.1 Princípio
**O código decide; a IA só escreve** (herdado do projeto MFA). A IA nunca altera dados nem números calculados. Se ela falhar, o app continua funcionando.

### 6.2 Regras [PDF]
- Provedor principal: **Google AI Studio (Gemini)**, plano gratuito. Reserva: **OpenRouter** (modelos `:free`; limites de 20 req/min e 50/dia).
- Chamada **somente pelo backend**; a chave nunca vai ao navegador.
- Atrás da chave `AI_AGENT_ENABLED`, por meio do service `aiProvider`.
- **Somente leitura:** não cria, edita nem apaga nada.
- **Contexto enviado:** totais agregados do mês atual e do anterior, orçamentos, metas e renda. **Sem nome, e-mail ou descrições.**
- Limites: 20 perguntas por usuário por dia; 15 s por resposta.
- Registro em `historico_acoes` (`IA_PERGUNTA`); o **conteúdo da conversa não é gravado**.

### 6.3 Fluxo [proposta]
1. Controller valida a pergunta e confere flag e limite diário.
2. O service monta o contexto agregado **a partir do banco** (nunca do que o cliente envia).
3. `aiProvider` tenta Gemini; em erro, timeout ou limite, tenta OpenRouter; se também falhar, devolve mensagem fixa em português ("O assistente está indisponível agora").
4. A resposta é devolvida; a avaliação positiva/negativa é guardada no histórico.

### 6.4 Segurança da IA (do MFA)
- Chave só em header e só em variável de ambiente.
- Mensagens de erro têm texto fixo, **nunca** o corpo da resposta do provedor.
- Aviso na tela: "Respostas geradas por IA podem conter erros. Não é recomendação financeira."
- Plano gratuito do Gemini pode usar dados para melhorar produtos: por isso só dados agregados saem do sistema.
- **Dependência nova ou troca de provedor/biblioteca: avisar antes.**

### 6.5 Critérios para permanecer
Definidos em `01-escopo.md` §6 (8/10 corretas, mediana ≤ 5 s, nenhuma falha de limite na demo, revisão de privacidade). Se falhar, o agente é removido e o escopo volta ao MVP.

## 7. Variáveis de ambiente [proposta]
| Variável | Para quê |
|---|---|
| `PORT` | porta da API |
| `MYSQL_URL` (ou host/usuário/senha/banco) | conexão MySQL |
| `MONGO_URL` | conexão MongoDB |
| `JWT_SECRET` | assinatura do token (mínimo de 32 caracteres) |
| `JWT_EXPIRACAO` | validade do token |
| `CORS_ORIGINS` | origens permitidas (front local) |
| `RESEND_API_KEY`, `EMAIL_REMETENTE` | envio do código 2FA |
| `AI_AGENT_ENABLED` | liga/desliga o agente |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | provedor principal |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | reserva |

Nomes de modelos ficam só em variável de ambiente. Valores reais nunca vão ao Git.

## 8. Pendências para ADR
- Biblioteca de validação (ex.: zod, joi ou express-validator) e de testes.
- Ferramenta de migrations e de seed.
- Política de cookie em ambiente local (Secure/SameSite com front e API em portas diferentes).
