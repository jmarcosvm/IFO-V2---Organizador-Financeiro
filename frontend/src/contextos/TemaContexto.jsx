import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const CHAVE = 'ifo:tema';

export const TemaContexto = createContext(null);

function lerTemaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === 'claro' || salvo === 'escuro') return salvo;
  } catch {
    // localStorage pode estar bloqueado; segue o tema do sistema.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(lerTemaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro');
    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      // sem persistência: o tema vale só até recarregar.
    }
  }, [tema]);

  const alternar = useCallback(() => setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro')), []);
  const valor = useMemo(() => ({ tema, alternar }), [tema, alternar]);

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>;
}
