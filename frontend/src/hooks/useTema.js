import { useContext } from 'react';
import { TemaContexto } from '../contextos/TemaContexto.jsx';

export function useTema() {
  const contexto = useContext(TemaContexto);
  if (!contexto) throw new Error('useTema precisa estar dentro de <TemaProvider>.');
  return contexto;
}
