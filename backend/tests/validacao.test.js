import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { validar } from '../src/middlewares/validar.middleware.js';
import { tratarErro } from '../src/middlewares/erro.middleware.js';

const esquemas = {
  body: z.object({
    email: z.email({ error: 'e-mail inválido' }),
    senha: z.string().min(8, { error: 'mínimo de 8 caracteres' }),
  }),
  query: z.object({
    pagina: z.coerce.number().int().min(1).default(1),
  }),
};

function criarApp() {
  const app = express();
  app.use(express.json());
  app.post('/teste', validar(esquemas), (req, res) => res.json(req.dados));
  app.use(tratarErro);
  return app;
}

describe('middleware validar (Zod)', () => {
  it('aceita dados válidos e entrega os dados tratados em req.dados', async () => {
    const res = await request(criarApp())
      .post('/teste?pagina=2')
      .send({ email: 'ana@exemplo.com', senha: '12345678' });

    expect(res.status).toBe(200);
    expect(res.body.body).toEqual({ email: 'ana@exemplo.com', senha: '12345678' });
    expect(res.body.query).toEqual({ pagina: 2 });
  });

  it('aplica o valor padrão da query quando ela não é enviada', async () => {
    const res = await request(criarApp())
      .post('/teste')
      .send({ email: 'ana@exemplo.com', senha: '12345678' });

    expect(res.body.query).toEqual({ pagina: 1 });
  });

  it('rejeita com 400 VALIDACAO e lista os campos com problema', async () => {
    const res = await request(criarApp()).post('/teste').send({ email: 'nao-e-email', senha: '123' });

    expect(res.status).toBe(400);
    expect(res.body.erro.codigo).toBe('VALIDACAO');
    expect(res.body.erro.campos).toEqual({
      email: 'e-mail inválido',
      senha: 'mínimo de 8 caracteres',
    });
  });

  it('rejeita campo ausente e query inválida', async () => {
    const res = await request(criarApp()).post('/teste?pagina=0').send({});

    expect(res.status).toBe(400);
    expect(Object.keys(res.body.erro.campos)).toEqual(
      expect.arrayContaining(['email', 'senha', 'pagina']),
    );
  });
});
