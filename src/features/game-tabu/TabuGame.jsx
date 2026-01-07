import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import TabuPlay from './screens/TabuPlay/TabuPlay';
import TabuScore from './screens/TabuScore/TabuScore';
import TabuSetup from './screens/TabuSetup/TabuSetup';
import TabuReady from './screens/TabuReady/TabuReady';
import { useTabuStore } from './stores/useTabuStore';

import styles from './TabuGame.module.scss';

const TabuGame = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useTabuStore();

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Semantic Header */}
        <header className={styles.header}>
          <button
            type="button"
            onClick={handleBack}
            aria-label="Volver al menú"
            className={styles.backButton}>
            <ArrowLeft />
          </button>

          <h1 className={styles.title}>TABÚ</h1>

          <div className={styles.spacer} aria-hidden="true" />
        </header>

        {/* Main Game Content */}
        <main className={styles.main}>
          {gameState === 'setup' && <TabuSetup />}
          {gameState === 'turnReady' && <TabuReady />}
          {gameState === 'playing' && <TabuPlay />}
          {gameState === 'roundOver' && <TabuScore />}
        </main>
      </div>
    </MainLayout>
  );
};

export default TabuGame;
