let nextStage = { "id":  1000, "nextStageScore": 10, "scorePerSecond": 1 };
let UnlockItem = [{ "id": 1, "score": 10, "width": 33.33, "height": 33.33, "image": "images/items/pokeball_red.png" }]
let UnlockItemState = false;

export const handleEvent = (data) => {
    if(data.type === "stage") {
        nextStage = data.stage;
        UnlockItemState = true;
    }        
    else if(data.type === "Item") {
        UnlockItem = data.Unlock_Items;
    }        
};

export const getNextStage = () => {
    return nextStage;
};

export const getUnlockItem = () => {
    return UnlockItem;
};

export const getUnlockItemState = () => {    
    return UnlockItemState;
};

export const setUnlockItemState = (state) => {    
    UnlockItemState = state;
};