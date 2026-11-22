import { Router } from 'express';
import { obterSaude } from '../controllers/saude.controller.js';

const router = Router();

router.get('/saude', obterSaude);

export default router;
