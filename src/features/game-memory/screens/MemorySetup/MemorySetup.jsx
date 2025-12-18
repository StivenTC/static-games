import { usePlayerStore } from '../../../../shared/stores/usePlayerStore';
import GameSetup from '../../../../shared/ui/GameSetup/GameSetup';
import { useMemoryStore } from '../../stores/useMemoryStore';

const MemorySetup = () => {
  const { setupGame } = useMemoryStore();
  const { players } = usePlayerStore();

  return (
    <GameSetup
      title="Memoria"
      themeColor="#00ff9f"
      minPlayers={1}
      onStart={() => setupGame(players)}
    />
  );
};

export default MemorySetup;
