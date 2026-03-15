import { ArrowLeft } from 'lucide-react';
import { useBlocker, useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button/Button';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import styles from './TabuGame.module.scss';
import TabuPlay from './screens/TabuPlay/TabuPlay';
import TabuReady from './screens/TabuReady/TabuReady';
import TabuScore from './screens/TabuScore/TabuScore';
import TabuSetup from './screens/TabuSetup/TabuSetup';
import { useTabuStore } from './stores/useTabuStore';

const TabuGame = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useTabuStore();

  const blocker = useBlocker(gameState !== 'setup');

  const handleBack = () => navigate('/');

  return (
    <MainLayout>
      <div className={styles.container}>
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

        <main className={styles.main}>
          {gameState === 'setup' && <TabuSetup />}
          {gameState === 'turnReady' && <TabuReady />}
          {gameState === 'playing' && <TabuPlay />}
          {gameState === 'roundOver' && <TabuScore />}
        </main>
      </div>

      {blocker.state === 'blocked' && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <p>¿Salir del juego? Se perderá el progreso.</p>
            <div className={styles.confirmActions}>
              <Button variant="outline" onClick={() => blocker.reset()}>
                Seguir jugando
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  resetGame();
                  blocker.proceed();
                }}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default TabuGame;
