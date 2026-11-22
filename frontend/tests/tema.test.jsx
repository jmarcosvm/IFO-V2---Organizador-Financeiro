import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemaProvider } from '../src/contextos/TemaContexto.jsx';
import BotaoTema from '../src/componentes/BotaoTema.jsx';

function renderizar() {
  return render(
    <TemaProvider>
      <BotaoTema />
    </TemaProvider>,
  );
}

describe('tema claro/escuro', () => {
  it('começa claro e alterna para escuro, marcando <html class="dark"> e salvando a escolha', async () => {
    const usuario = userEvent.setup();
    renderizar();

    const botao = screen.getByRole('button', { name: /tema claro/i });
    expect(botao).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement).not.toHaveClass('dark');

    await usuario.click(botao);

    expect(screen.getByRole('button', { name: /tema escuro/i })).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('ifo:tema')).toBe('escuro');
  });

  it('volta ao claro ao clicar de novo', async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.click(screen.getByRole('button'));
    await usuario.click(screen.getByRole('button'));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('ifo:tema')).toBe('claro');
  });

  it('respeita a escolha salva no localStorage', () => {
    localStorage.setItem('ifo:tema', 'escuro');
    renderizar();

    expect(screen.getByRole('button', { name: /tema escuro/i })).toBeInTheDocument();
    expect(document.documentElement).toHaveClass('dark');
  });
});
