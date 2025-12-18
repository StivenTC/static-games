import TabuPlay from './screens/TabuPlay';
import TabuSetup from './screens/TabuSetup';
import { useTabuStore } from './stores/useTabuStore';

const TabuGame = () => {
  const { gameState } = useTabuStore();

  if (gameState === 'setup') {
    return <TabuSetup />;
  }

  return <TabuPlay />;
};

export default TabuGame;
