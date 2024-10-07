import { moveStageHandler } from './stage.handler.js';
import { unlockItemHandler } from './item.handler.js';
import { gameEnd, gameStart } from './game.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  12: unlockItemHandler,
};

export default handlerMappings;