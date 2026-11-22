import { Link } from 'react-router-dom';

export default function NaoEncontrada() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-ink-2">O endereço que você abriu não existe.</p>
      <Link to="/" className="font-medium text-brand underline">
        Voltar ao início
      </Link>
    </section>
  );
}
