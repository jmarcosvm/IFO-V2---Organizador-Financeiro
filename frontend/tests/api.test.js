import { describe, it, expect, vi } from 'vitest';
import { api, ErroApi } from '../src/servicos/api.js';

function respostaJson(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('cliente HTTP (servicos/api)', () => {
  it('GET envia o cookie (credentials: include) e devolve o JSON', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respostaJson({ status: 'ok' }));
    vi.stubGlobal('fetch', fetchFalso);

    const dados = await api.get('/api/saude');

    expect(dados).toEqual({ status: 'ok' });
    const [url, opcoes] = fetchFalso.mock.calls[0];
    expect(url).toBe('/api/saude');
    expect(opcoes.method).toBe('GET');
    expect(opcoes.credentials).toBe('include');
  });

  it('POST serializa o corpo como JSON', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respostaJson({ ok: true }, 201));
    vi.stubGlobal('fetch', fetchFalso);

    await api.post('/api/exemplo', { nome: 'Ana' });

    const [, opcoes] = fetchFalso.mock.calls[0];
    expect(opcoes.method).toBe('POST');
    expect(opcoes.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(opcoes.body).toBe('{"nome":"Ana"}');
  });

  it('converte o erro padrão da API em ErroApi com código, mensagem e campos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        respostaJson(
          { erro: { codigo: 'VALIDACAO', mensagem: 'Senha curta.', campos: { senha: 'mínimo de 8' } } },
          400,
        ),
      ),
    );

    await expect(api.post('/api/x', {})).rejects.toMatchObject({
      name: 'ErroApi',
      status: 400,
      codigo: 'VALIDACAO',
      message: 'Senha curta.',
      campos: { senha: 'mínimo de 8' },
    });
  });

  it('resposta de erro sem corpo conhecido vira ERRO_INTERNO', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>', { status: 502 })));

    const erro = await api.get('/api/x').catch((e) => e);

    expect(erro).toBeInstanceOf(ErroApi);
    expect(erro.status).toBe(502);
    expect(erro.codigo).toBe('ERRO_INTERNO');
  });

  it('falha de rede vira SEM_CONEXAO', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const erro = await api.get('/api/x').catch((e) => e);

    expect(erro).toBeInstanceOf(ErroApi);
    expect(erro.codigo).toBe('SEM_CONEXAO');
    expect(erro.status).toBe(0);
  });
});
