import { Link, Outlet } from 'react-router-dom';
import BotaoTema from './BotaoTema.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-brand">
            IFO
          </Link>
          <BotaoTema />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
