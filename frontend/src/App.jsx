import { Route, Routes } from 'react-router-dom';
import Layout from './componentes/Layout.jsx';
import Inicio from './paginas/Inicio.jsx';
import NaoEncontrada from './paginas/NaoEncontrada.jsx';

// Cada sprint acrescenta suas rotas aqui, dentro do Layout.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
