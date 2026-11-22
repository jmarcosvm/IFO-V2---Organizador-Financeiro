import { verificarSaude } from '../services/saude.service.js';

// Controller: lê a requisição, chama o service e devolve a resposta HTTP.
export function obterSaude(_req, res) {
  res.json(verificarSaude());
}
