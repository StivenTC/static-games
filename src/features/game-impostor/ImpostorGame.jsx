import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../shared/layouts/MainLayout';
import GameSetup from '../../shared/ui/GameSetup';
import DebateScreen from './screens/DebateScreen/DebateScreen';
import ResultScreen from './screens/ResultScreen/ResultScreen';
import RevealScreen from './screens/RevealScreen/RevealScreen';
import VotingScreen from './screens/VotingScreen/VotingScreen';
import { useImpostorStore } from './stores/useImpostorStore';

export default function ImpostorGame() {
  const navigate = useNavigate();
  const { phase, resetGame, players, startGame } = useImpostorStore();

  const handleBack = () => {
    // If game is in progress, maybe warn? For now just go back.
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
        <span style={{ fontWeight: 'bold', color: '#ff0055' }}>
          IMPOSTOR {phase !== 'SETUP' && `• ${players.length} Jugadores`}
        </span>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </div>

      {phase === 'SETUP' && (
        <GameSetup
          title="Impostor"
          onStart={startGame}
          minPlayers={3}
          themeColor="#ff0055"
        />
      )}
      {phase === 'REVEAL' && <RevealScreen themeColor="#ff0055" />}
      {phase === 'DEBATE' && <DebateScreen themeColor="#ff0055" />}
      {phase === 'VOTING' && <VotingScreen themeColor="#ff0055" />}
      {phase === 'RESULT' && <ResultScreen themeColor="#ff0055" />}
    </MainLayout>
  );
}
