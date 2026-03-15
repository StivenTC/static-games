import { createBrowserRouter } from 'react-router-dom';
import BastaGame from '../features/game-basta/BastaGame';
import ImpostorGame from '../features/game-impostor/ImpostorGame';
import MemoryGame from '../features/game-memory/MemoryGame';
import TabuGame from '../features/game-tabu/TabuGame';
import MenuPage from '../features/menu/MenuPage/MenuPage';
import ErrorBoundary from '../shared/ui/ErrorBoundary/ErrorBoundary';

const wrap = (element) => <ErrorBoundary>{element}</ErrorBoundary>;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MenuPage />,
    },
    {
      path: '/impostor',
      element: wrap(<ImpostorGame />),
    },
    {
      path: '/basta',
      element: wrap(<BastaGame />),
    },
    {
      path: '/tabu',
      element: wrap(<TabuGame />),
    },
    {
      path: '/memory',
      element: wrap(<MemoryGame />),
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
