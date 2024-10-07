const items = {};

export const createItem = (uuid) => {
    items[uuid] = [];
};

export const getItem = (uuid) => {
    return items[uuid];
};

export const setItem = (uuid, id, score, width, height, image) => {
    return items[uuid].push({ id, score, width, height, image });
};

export const clearItem = (uuid) => {
    return (items[uuid] = []);
  };
