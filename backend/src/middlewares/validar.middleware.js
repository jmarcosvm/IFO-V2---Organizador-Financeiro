import { ErroValidacao } from '../utils/erros.js';

/**
 * Valida body, query e params com esquemas Zod.
 * Em caso de sucesso, os dados já tratados ficam em `req.dados` ({ body, query, params }).
 * No Express 5, `req.query` é somente leitura, por isso não é sobrescrito.
 *
 * Uso: router.post('/', validar({ body: esquemaCadastro }), controller.criar)
 */
export function validar(esquemas) {
  return (req, _res, next) => {
    const campos = {};
    const dados = {};

    for (const parte of ['body', 'query', 'params']) {
      const esquema = esquemas[parte];
      if (!esquema) continue;

      const resultado = esquema.safeParse(req[parte] ?? {});
      if (resultado.success) {
        dados[parte] = resultado.data;
        continue;
      }
      for (const problema of resultado.error.issues) {
        const nome = problema.path.join('.') || parte;
        campos[nome] ??= problema.message;
      }
    }

    if (Object.keys(campos).length > 0) {
      const primeira = Object.values(campos)[0];
      return next(new ErroValidacao(primeira, campos));
    }

    req.dados = dados;
    next();
  };
}
