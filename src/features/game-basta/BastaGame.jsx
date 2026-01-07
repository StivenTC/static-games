import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/shared/layouts/MainLayout/MainLayout';
import GameSetup from '@/shared/ui/GameSetup/GameSetup';
import theme from '@/styles/theme.module.scss';
import styles from './BastaGame.module.scss';
import PlayScreen from './screens/PlayScreen/PlayScreen';
import ResultScreen from './screens/ResultScreen/ResultScreen';
import { useBastaStore } from './stores/useBastaStore';

export default function BastaGame() {
  const navigate = useNavigate();
  const { gameStatus, resetGame, startGame, gamePlayers } = useBastaStore();

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
            className={styles.backButton}
            aria-label="Volver al menú">
            <ArrowLeft />
          </button>

          <h1 className={styles.title}>
            BASTA{' '}
            {gameStatus !== 'setup' && (
              <span className={styles.playerCount}>
                • {gamePlayers.length} Jugadores
              </span>
            )}
          </h1>

          <div className={styles.placeholder} aria-hidden="true"></div>
        </header>

        {/* Main Game Area */}
        <main className={styles.mainContent}>
          {gameStatus === 'setup' && (
            <GameSetup
              title="Basta"
              onStart={(players) => startGame(players?.[0]?.id)}
              minPlayers={2}
              themeColor={theme.neonBlue}
            />
          )}

          {gameStatus === 'playing' && (
            <PlayScreen themeColor={theme.neonBlue} />
          )}

          {gameStatus === 'finished' && (
            <ResultScreen themeColor={theme.neonBlue} />
          )}
        </main>
      </div>
    </MainLayout>
  );
}
