import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';
import { naoEncontrado } from './middlewares/naoEncontrado.middleware.js';
import { tratarErro } from './middlewares/erro.middleware.js';

/**
 * Monta a aplicação Express sem ligar a porta (isso é papel do server.js).
 * Assim os testes chamam a API com Supertest, sem rede.
 *
 * @param {{ corsOrigins: string[] }} config
 */
export function createApp({ corsOrigins }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  // credentials: true porque a sessão virá em cookie httpOnly (R1); origens sempre explícitas.
  app.use(cors({ origin: corsOrigins, credentials: true }));
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', routes);

  app.use(naoEncontrado);
  app.use(tratarErro);

  return app;
}
