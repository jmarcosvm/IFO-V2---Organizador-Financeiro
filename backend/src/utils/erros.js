// Erros tipados: os services lançam, o middleware de erro converte em resposta HTTP
// no formato único de docs/05-api.md §2.

export class AppError extends Error {
  constructor(status, codigo, mensagem, campos) {
    super(mensagem);
    this.name = 'AppError';
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
  }
}

export class ErroValidacao extends AppError {
  constructor(mensagem = 'Dados inválidos.', campos) {
    super(400, 'VALIDACAO', mensagem, campos);
    this.name = 'ErroValidacao';
  }
}

export class ErroNaoEncontrado extends AppError {
  constructor(mensagem = 'Recurso não encontrado.') {
    super(404, 'NAO_ENCONTRADO', mensagem);
    this.name = 'ErroNaoEncontrado';
  }
}
