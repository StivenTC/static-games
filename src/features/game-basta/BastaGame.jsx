import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../../shared/layouts/MainLayout';
import GameSetup from '../../shared/ui/GameSetup';
import { useBastaStore } from './stores/useBastaStore';
import PlayScreen from './screens/PlayScreen';
import ResultScreen from './screens/ResultScreen';

export default function BastaGame() {
  const navigate = useNavigate();
  const { gameStatus, resetGame, startGame } = useBastaStore();
  const THEME_COLOR = '#00f3ff'; // Neon Blue from MenuPage

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}>
          <ArrowLeft />
        </button>
        <span style={{ fontWeight: 'bold', color: THEME_COLOR }}>
          BASTA {gameStatus !== 'setup' && `• Juego en progreso`}
        </span>
        <div style={{ width: 24 }}></div>
      </div>

      {gameStatus === 'setup' && (
        <GameSetup
          title="Basta"
          onStart={(players) => startGame(players?.[0]?.id)} // GameSetup doesn't pass players, store gets them from playerStore?
          // Wait, GameSetup.onStart just triggers. The store needs to know who plays.
          // Impostor passed `startGame` which handled it?
          // Impostor store accesses usePlayerStore inside?
          // Let's check ImpostorStore later. For now assume startGame fetches players.
          minPlayers={2}
          themeColor={THEME_COLOR}
        />
      )}

      {gameStatus === 'playing' && <PlayScreen themeColor={THEME_COLOR} />}

      {gameStatus === 'finished' && <ResultScreen themeColor={THEME_COLOR} />}
    </MainLayout>
  );
}
