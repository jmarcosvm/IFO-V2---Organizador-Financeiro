import { describe, it, expect } from 'vitest';
import { carregarEnv } from '../src/config/env.js';

describe('carregarEnv (Zod)', () => {
  it('usa os valores padrão quando nada é informado', () => {
    const env = carregarEnv({});

    expect(env).toEqual({
      NODE_ENV: 'development',
      PORT: 3001,
      CORS_ORIGINS: ['http://localhost:5173'],
    });
  });

  it('converte PORT para número e separa as origens por vírgula', () => {
    const env = carregarEnv({
      PORT: '4000',
      CORS_ORIGINS: 'http://localhost:5173, http://127.0.0.1:5173',
    });

    expect(env.PORT).toBe(4000);
    expect(env.CORS_ORIGINS).toEqual(['http://localhost:5173', 'http://127.0.0.1:5173']);
  });

  it('falha com mensagem clara quando PORT é inválida', () => {
    expect(() => carregarEnv({ PORT: 'abc' })).toThrow(/PORT/);
    expect(() => carregarEnv({ PORT: '70000' })).toThrow(/PORT/);
  });

  it('não aceita "*" no CORS_ORIGINS', () => {
    expect(() => carregarEnv({ CORS_ORIGINS: '*' })).toThrow(/CORS_ORIGINS/);
  });

  it('não aceita NODE_ENV desconhecido', () => {
    expect(() => carregarEnv({ NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });
});
