import Item from "./Item.js";
import { getUnlockItem, getUnlockItemState, setUnlockItemState } from './handlers/response.handler.js';

class ItemController {

    INTERVAL_MIN = 0;
    INTERVAL_MAX = 12000;

    nextInterval = null;
    items = [];


    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
    }

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem() {
        const index = this.getRandomNumber(0, this.itemImages.length - 1);
        const itemInfo = this.itemImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        const item = new Item(
            this.ctx,
            itemInfo.id,
            itemInfo.score,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );

        this.items.push(item);
    }


    update(gameSpeed, deltaTime) {
        if (this.nextInterval <= 0) {
            this.createItem();
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.items = this.items.filter(item => item.x > -item.width);

        if (getUnlockItemState()) {
            this.setItemController(getUnlockItem());
            setUnlockItemState(false);
        }
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id,
                itemScore: collidedItem.score
            }
        }
    }

    setItemController(addItemImages) {
        this.itemImages = addItemImages.map((item) => {
            const image = new Image();
            image.src = item.image;
            return {
                id: item.id,
                score: item.score,
                width: item.width * this.getScaleRatio(),
                height: item.height * this.getScaleRatio(),
                image,
            };
        });
    }

    reset() {
        this.items = [];
    }

    getScaleRatio() {
        const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
        const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);
      
        // window is wider than the game width
        if (screenWidth / screenHeight < 800 / 200) {
          return screenWidth / 800;
        } else {
          return screenHeight / 200;
        }
      }
}

export default ItemController;