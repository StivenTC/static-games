import { ArrowLeft } from 'lucide-react';
import { useBlocker, useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button/Button';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import styles from './MemoryGame.module.scss';
import MemoryPlay from './screens/MemoryPlay/MemoryPlay';
import MemoryScore from './screens/MemoryScore/MemoryScore';
import MemorySetup from './screens/MemorySetup/MemorySetup';
import { useMemoryStore } from './stores/useMemoryStore';

const MemoryGame = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useMemoryStore();

  const blocker = useBlocker(gameState !== 'setup');

  const handleBack = () => navigate('/');

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

          <h1 className={styles.title}>MEMORIA</h1>

          <div className={styles.spacer} aria-hidden="true" />
        </header>

        {/* Main Game Content */}
        <main className={styles.mainContent}>
          {gameState === 'setup' && <MemorySetup />}
          {(gameState === 'watching' || gameState === 'playing') && (
            <MemoryPlay />
          )}
          {gameState === 'gameover' && <MemoryScore />}
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

export default MemoryGame;
