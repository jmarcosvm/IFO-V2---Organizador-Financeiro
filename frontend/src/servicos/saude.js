import { api } from './api.js';

export function obterSaude(opcoes) {
  return api.get('/api/saude', opcoes);
}
