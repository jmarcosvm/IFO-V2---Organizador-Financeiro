import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { TemaProvider } from '../src/contextos/TemaContexto.jsx';

function renderizarEm(caminho) {
  return render(
    <TemaProvider>
      <MemoryRouter initialEntries={[caminho]}>
        <App />
      </MemoryRouter>
    </TemaProvider>,
  );
}

function respostaJson(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('página inicial', () => {
  it('mostra "API no ar" quando /api/saude responde ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson({ status: 'ok' })));
    renderizarEm('/');

    expect(screen.getByRole('status')).toHaveTextContent('Conferindo a API...');
    expect(await screen.findByText('API no ar.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /inteligência financeira organizada/i })).toBeInTheDocument();
  });

  it('avisa quando a API não responde', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    renderizarEm('/');

    expect(await screen.findByText(/a api não respondeu/i)).toBeInTheDocument();
  });

  it('chama a API pelo caminho /api/saude', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respostaJson({ status: 'ok' }));
    vi.stubGlobal('fetch', fetchFalso);
    renderizarEm('/');

    await screen.findByText('API no ar.');
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/saude');
  });
});

describe('rotas', () => {
  it('endereço desconhecido mostra "Página não encontrada" com o botão de tema do layout', () => {
    vi.stubGlobal('fetch', vi.fn());
    renderizarEm('/nao-existe');

    expect(screen.getByRole('heading', { name: /página não encontrada/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar ao início/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: /tema/i })).toBeInTheDocument();
  });
});
