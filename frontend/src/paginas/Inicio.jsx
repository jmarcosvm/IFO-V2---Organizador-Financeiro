import { useSaudeApi } from '../hooks/useSaudeApi.js';

const MENSAGENS = {
  carregando: 'Conferindo a API...',
  ok: 'API no ar.',
  erro: 'A API não respondeu. Confira se o backend está rodando.',
};

const COR = {
  carregando: 'text-ink-2',
  ok: 'text-ok',
  erro: 'text-erro',
};

export default function Inicio() {
  const estado = useSaudeApi();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Inteligência Financeira Organizada</h1>
      <p className="text-ink-2">
        Organize receitas e despesas com a regra 50/30/20. As telas chegam nas próximas sprints.
      </p>
      <p role="status" className={`rounded-lg border border-line bg-surface p-4 font-medium ${COR[estado]}`}>
        {MENSAGENS[estado]}
      </p>
    </section>
  );
}
