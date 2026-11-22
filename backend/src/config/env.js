import { z } from 'zod';

const esquemaEnv = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce
    .number({ error: 'PORT deve ser um número.' })
    .int()
    .min(1, { error: 'PORT deve estar entre 1 e 65535.' })
    .max(65535, { error: 'PORT deve estar entre 1 e 65535.' })
    .default(3001),
  // Lista separada por vírgula. Nunca "*": a API usa cookie e precisa de origem explícita.
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((texto) =>
      texto
        .split(',')
        .map((origem) => origem.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.url({ error: 'CORS_ORIGINS deve conter URLs válidas separadas por vírgula.' }))
        .min(1, { error: 'CORS_ORIGINS não pode ficar vazio.' }),
    ),
});

/**
 * Lê e valida as variáveis de ambiente. Falha cedo, com mensagem clara,
 * em vez de deixar o servidor subir com configuração errada.
 */
export function carregarEnv(fonte = process.env) {
  const resultado = esquemaEnv.safeParse(fonte);
  if (!resultado.success) {
    const detalhes = resultado.error.issues
      .map((problema) => `- ${problema.path.join('.') || 'env'}: ${problema.message}`)
      .join('\n');
    throw new Error(`Configuração de ambiente inválida:\n${detalhes}`);
  }
  return resultado.data;
}
