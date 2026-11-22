import { Router } from 'express';
import saudeRoutes from './saude.routes.js';

// Todas as rotas da API ficam sob /api. Cada rota nova acrescenta uma linha aqui.
const router = Router();

router.use(saudeRoutes);

export default router;
