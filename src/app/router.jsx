import { createBrowserRouter } from 'react-router-dom';
import MenuPage from '../features/menu/MenuPage';
import BastaGame from '../features/game-basta/BastaGame';
import ImpostorGame from '../features/game-impostor/ImpostorGame';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MenuPage />,
    },
    {
      path: '/impostor',
      element: <ImpostorGame />,
    },
    {
      path: '/basta',
      element: <BastaGame />,
    },
    {
      path: '/tabu',
      element: <div style={{ color: 'white' }}>Tabú Game (Coming Soon)</div>,
    },
    {
      path: '/memory',
      element: <div style={{ color: 'white' }}>Memory Game (Coming Soon)</div>,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
