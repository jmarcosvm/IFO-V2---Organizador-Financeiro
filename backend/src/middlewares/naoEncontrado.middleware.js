import { ErroNaoEncontrado } from '../utils/erros.js';

// Última rota antes do middleware de erro: tudo que ninguém atendeu vira 404 no formato padrão.
export function naoEncontrado(_req, _res, next) {
  next(new ErroNaoEncontrado('Rota não encontrada.'));
}
