import { createBrowserRouter } from 'react-router-dom';
import BastaGame from '../features/game-basta/BastaGame';
import ImpostorGame from '../features/game-impostor/ImpostorGame';
import TabuGame from '../features/game-tabu/TabuGame';
import MenuPage from '../features/menu/MenuPage/MenuPage';

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
      element: <TabuGame />,
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
