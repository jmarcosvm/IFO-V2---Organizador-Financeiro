import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { tratarErro } from '../src/middlewares/erro.middleware.js';
import { ErroNaoEncontrado, ErroValidacao } from '../src/utils/erros.js';

// App mínimo só para provocar erros que a API real ainda não tem.
function appComRotaQueFalha(falha) {
  const app = express();
  app.get('/falha', async () => {
    throw falha;
  });
  app.use(tratarErro);
  return app;
}

describe('formato único de erro', () => {
  it('rota inexistente responde 404 NAO_ENCONTRADO', async () => {
    const app = createApp({ corsOrigins: ['http://localhost:5173'] });
    const res = await request(app).get('/api/nao-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      erro: { codigo: 'NAO_ENCONTRADO', mensagem: 'Rota não encontrada.' },
    });
  });

  it('JSON malformado responde 400 VALIDACAO', async () => {
    const app = createApp({ corsOrigins: ['http://localhost:5173'] });
    const res = await request(app)
      .post('/api/saude')
      .set('Content-Type', 'application/json')
      .send('{ isto nao e json');

    expect(res.status).toBe(400);
    expect(res.body.erro.codigo).toBe('VALIDACAO');
  });

  it('ErroValidacao devolve 400 com os campos', async () => {
    const res = await request(
      appComRotaQueFalha(new ErroValidacao('Senha curta.', { senha: 'mínimo de 8 caracteres' })),
    ).get('/falha');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      erro: {
        codigo: 'VALIDACAO',
        mensagem: 'Senha curta.',
        campos: { senha: 'mínimo de 8 caracteres' },
      },
    });
  });

  it('ErroNaoEncontrado devolve 404', async () => {
    const res = await request(appComRotaQueFalha(new ErroNaoEncontrado('Transação não encontrada.'))).get(
      '/falha',
    );

    expect(res.status).toBe(404);
    expect(res.body.erro).toEqual({ codigo: 'NAO_ENCONTRADO', mensagem: 'Transação não encontrada.' });
  });

  it('erro inesperado responde 500 com mensagem fixa, sem stack nem texto interno', async () => {
    const res = await request(
      appComRotaQueFalha(new Error('senha do banco: segredo123')),
    ).get('/falha');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      erro: { codigo: 'ERRO_INTERNO', mensagem: 'Erro interno. Tente novamente mais tarde.' },
    });
    expect(JSON.stringify(res.body)).not.toContain('segredo123');
    expect(JSON.stringify(res.body)).not.toContain('stack');
  });
});
