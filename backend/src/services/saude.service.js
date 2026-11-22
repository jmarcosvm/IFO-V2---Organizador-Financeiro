// Regra de negócio da checagem de saúde. Não conhece HTTP (nada de req/res).
// Na R0 parte 7 passa a conferir também a conexão com MySQL e MongoDB.
export function verificarSaude() {
  return { status: 'ok' };
}
