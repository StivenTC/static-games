import { Ban, Brain, Ghost, MessageCircle, Zap } from 'lucide-react';

import MainLayout from '../../../shared/layouts/MainLayout/MainLayout';
import GameCard from '../GameCard/GameCard';
import theme from '@/styles/theme.module.scss';
import styles from './MenuPage.module.scss';

const GAMES = [
  {
    id: 'impostor',
    title: 'Impostor',
    icon: Ghost,
    color: theme.neonRed,
    path: '/impostor',
  },
  {
    id: 'basta',
    title: 'Basta',
    icon: Zap,
    color: theme.neonBlue,
    path: '/basta',
  },
  {
    id: 'tabu',
    title: 'Tabú',
    icon: Ban,
    color: theme.neonPurple,
    path: '/tabu',
  },
  {
    id: 'memory',
    title: 'Memoria',
    icon: Brain,
    color: theme.neonGreen,
    path: '/memory',
  },
  {
    id: 'legacy',
    title: 'Questionary',
    icon: MessageCircle,
    color: theme.white,
    path: 'https://questionary-9c8b1.web.app/',
    isExternal: true,
    spanCols: true,
  },
];

export default function MenuPage() {
  return (
    <MainLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>STATIC</h1>
      </header>

      <nav className={styles.grid} aria-label="Selección de juegos">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            {...game}
            className={game.spanCols ? styles.fullWidth : ''}
          />
        ))}
      </nav>
    </MainLayout>
  );
}
