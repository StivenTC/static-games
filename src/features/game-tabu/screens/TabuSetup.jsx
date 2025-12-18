import GameSetup from '../../../shared/ui/GameSetup/GameSetup';
import { useTabuStore } from '../stores/useTabuStore';

const TabuSetup = () => {
  const { setupGame } = useTabuStore();

  return (
    <GameSetup
      title="Tabú"
      themeColor="var(--color-game-tabu)"
      minPlayers={2}
      onStart={setupGame}
    />
  );
};

export default TabuSetup;
