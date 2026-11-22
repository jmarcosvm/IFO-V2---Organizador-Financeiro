import { useTema } from '../hooks/useTema.js';

export default function BotaoTema() {
  const { tema, alternar } = useTema();
  const escuro = tema === 'escuro';

  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={escuro}
      className="min-h-10 min-w-10 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {escuro ? 'Tema escuro' : 'Tema claro'}
    </button>
  );
}
