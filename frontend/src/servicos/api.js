// Cliente HTTP único do frontend: toda chamada à API passa por aqui.
// Ele manda o cookie de sessão (credentials), converte erro no formato de docs/05-api.md §2
// em ErroApi e nunca deixa a tela lidar com fetch cru.

const BASE = import.meta.env?.VITE_API_URL ?? '';

export class ErroApi extends Error {
  constructor(status, codigo, mensagem, campos) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
  }
}

export async function requisitar(caminho, { metodo = 'GET', corpo, signal } = {}) {
  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      method: metodo,
      credentials: 'include',
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal,
    });
  } catch (erro) {
    if (erro?.name === 'AbortError') throw erro;
    throw new ErroApi(0, 'SEM_CONEXAO', 'Não foi possível falar com o servidor.');
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const detalhe = dados?.erro;
    throw new ErroApi(
      resposta.status,
      detalhe?.codigo ?? 'ERRO_INTERNO',
      detalhe?.mensagem ?? 'Erro inesperado. Tente novamente.',
      detalhe?.campos,
    );
  }
  return dados;
}

export const api = {
  get: (caminho, opcoes) => requisitar(caminho, { ...opcoes, metodo: 'GET' }),
  post: (caminho, corpo, opcoes) => requisitar(caminho, { ...opcoes, metodo: 'POST', corpo }),
  put: (caminho, corpo, opcoes) => requisitar(caminho, { ...opcoes, metodo: 'PUT', corpo }),
  delete: (caminho, opcoes) => requisitar(caminho, { ...opcoes, metodo: 'DELETE' }),
};
