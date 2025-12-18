import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../shared/layouts/MainLayout/MainLayout';
import MemoryPlay from './screens/MemoryPlay';
import MemoryScore from './screens/MemoryScore';
import MemorySetup from './screens/MemorySetup';
import { useMemoryStore } from './stores/useMemoryStore';

const MemoryGame = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useMemoryStore();

  const THEME_COLOR = '#00ff9f'; // Neon Green

  const handleBack = () => {
    resetGame();
    navigate('/');
  };

  return (
    <MainLayout>
      <div
        style={{
          padding: '1rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {/* Semantic Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
          <button
            type="button"
            onClick={handleBack}
            aria-label="Volver al menú"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}>
            <ArrowLeft />
          </button>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: THEME_COLOR,
              margin: 0,
              textShadow: `0 0 10px ${THEME_COLOR}66`,
            }}>
            MEMORIA
          </h1>

          <div style={{ width: 24 }} aria-hidden="true" />
        </header>

        {/* Main Game Content */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
          {gameState === 'setup' && <MemorySetup />}
          {(gameState === 'watching' || gameState === 'playing') && (
            <MemoryPlay />
          )}
          {gameState === 'gameover' && <MemoryScore />}
        </main>
      </div>
    </MainLayout>
  );
};

export default MemoryGame;
