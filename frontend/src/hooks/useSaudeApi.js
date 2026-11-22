import { useEffect, useState } from 'react';
import { obterSaude } from '../servicos/saude.js';

/** Consulta /api/saude uma vez. estado: 'carregando' | 'ok' | 'erro'. */
export function useSaudeApi() {
  const [estado, setEstado] = useState('carregando');

  useEffect(() => {
    const controle = new AbortController();
    obterSaude({ signal: controle.signal })
      .then((dados) => setEstado(dados?.status === 'ok' ? 'ok' : 'erro'))
      .catch((erro) => {
        if (erro?.name !== 'AbortError') setEstado('erro');
      });
    return () => controle.abort();
  }, []);

  return estado;
}
