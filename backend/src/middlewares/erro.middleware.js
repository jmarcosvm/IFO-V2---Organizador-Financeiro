import { AppError } from '../utils/erros.js';

// Middleware final: converte qualquer erro no formato único { erro: { codigo, mensagem, campos? } }.
// Erro inesperado devolve mensagem fixa: nunca stack trace nem texto interno.
// O quarto parâmetro (_next) é obrigatório para o Express reconhecer um tratador de erro.
export function tratarErro(erro, _req, res, _next) {
  if (erro instanceof AppError) {
    const corpo = { codigo: erro.codigo, mensagem: erro.message };
    if (erro.campos) corpo.campos = erro.campos;
    return res.status(erro.status).json({ erro: corpo });
  }

  // JSON malformado no corpo da requisição (erro do express.json)
  if (erro?.type === 'entity.parse.failed') {
    return res.status(400).json({
      erro: { codigo: 'VALIDACAO', mensagem: 'O corpo da requisição não é um JSON válido.' },
    });
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(erro);
  }
  return res.status(500).json({
    erro: { codigo: 'ERRO_INTERNO', mensagem: 'Erro interno. Tente novamente mais tarde.' },
  });
}
