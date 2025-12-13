import styles from './MenuPage.module.scss';
import MainLayout from '../../shared/layouts/MainLayout';
import GameCard from './GameCard';
import { Ghost, Zap, Ban, Brain, MessageCircle } from 'lucide-react';

const GAMES = [
  { 
    id: 'impostor', 
    title: 'Impostor', 
    icon: Ghost, 
    color: '#ff0055', // neon-red
    path: '/impostor' 
  },
  { 
    id: 'basta', 
    title: 'Basta', 
    icon: Zap, 
    color: '#00f3ff', // neon-blue
    path: '/basta' 
  },
  { 
    id: 'tabu', 
    title: 'Tabú', 
    icon: Ban, 
    color: '#bd00ff', // neon-purple
    path: '/tabu' 
  },
  { 
    id: 'memory', 
    title: 'Memoria', 
    icon: Brain, 
    color: '#00ff9f', // neon-green
    path: '/memory' 
  },
  { 
    id: 'legacy', 
    title: 'Legacy', 
    icon: MessageCircle, 
    color: '#ffffff', // white
    path: '/legacy',
    isExternal: true 
  },
];

export default function MenuPage() {
  return (
    <MainLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>STATIC</h1>
      </header>
      
      <div className={styles.grid}>
        {GAMES.map((game) => (
          <GameCard 
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </MainLayout>
  );
}
