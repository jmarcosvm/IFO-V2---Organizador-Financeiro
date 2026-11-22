import { createApp } from './app.js';
import { carregarEnv } from './config/env.js';

// Único lugar que lê o ambiente real e liga a porta.
let env;
try {
  env = carregarEnv();
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}

const app = createApp({ corsOrigins: env.CORS_ORIGINS });

app.listen(env.PORT, () => {
  console.log(`API do IFO V2 ouvindo em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});
