import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp({ corsOrigins: ['http://localhost:5173'] });

describe('GET /api/saude', () => {
  it('responde 200 com { status: "ok" }', async () => {
    const res = await request(app).get('/api/saude');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('envia cabeçalhos de segurança do helmet e não revela o Express', async () => {
    const res = await request(app).get('/api/saude');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('libera o CORS só para a origem configurada', async () => {
    const permitida = await request(app).get('/api/saude').set('Origin', 'http://localhost:5173');
    const negada = await request(app).get('/api/saude').set('Origin', 'http://site-malicioso.com');

    expect(permitida.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(permitida.headers['access-control-allow-credentials']).toBe('true');
    expect(negada.headers['access-control-allow-origin']).toBeUndefined();
  });
});
