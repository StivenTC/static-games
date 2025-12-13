import { createBrowserRouter } from 'react-router-dom';
import MenuPage from '../features/menu/MenuPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MenuPage />,
  },
  {
    path: '/impostor',
    element: <div style={{ color: 'white' }}>Impostor Game (Coming Soon)</div>,
  },
  {
    path: '/basta',
    element: <div style={{ color: 'white' }}>Basta Game (Coming Soon)</div>,
  },
  {
    path: '/tabu',
    element: <div style={{ color: 'white' }}>Tabú Game (Coming Soon)</div>,
  },
  {
    path: '/memory',
    element: <div style={{ color: 'white' }}>Memory Game (Coming Soon)</div>,
  },
], {
    future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
    }
});
