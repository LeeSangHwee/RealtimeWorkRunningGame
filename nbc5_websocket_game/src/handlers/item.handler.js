import { getItem, setItem } from '../models/item.model.js';
import { getGameAssets } from '../init/assets.js';

export const unlockItemHandler = (userId, payload) => {
    const { items, itemUnlocks } = getGameAssets();
   
    const itemUnlock = itemUnlocks.data.find((itemUnlock) => itemUnlock.stage_id === payload.stage);
    if(!itemUnlock) {
        return { status: 'fail', message: 'There are no more items to unlock' };
    }
    const item = items.data.find((item) => item.id === itemUnlock.item_id);  
    setItem(userId, item.id, item.score, item.width, item.height, item.image);
    
    const Unlock_Items = getItem(userId);
    return { type: 'Item', status: 'success', message: 'Item server update successfully', Unlock_Items};
  };