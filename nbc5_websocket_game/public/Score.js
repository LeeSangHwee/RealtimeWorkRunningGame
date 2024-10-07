import { sendEvent } from './Socket.js';
import { getNextStage } from './handlers/response.handler.js';

class Score {
  stage = 1000;
  nextStageScore = 100;
  score = 0;
  scorePerSec = 1;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scorePerSec;
    // 점수에 따른 스테이지 구분
    if (Math.floor(this.score) >= this.nextStageScore && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: this.stage, targetStage: (this.stage + 1) });      
    }
    else if (!this.stageChange) {
      this.setNextStage(getNextStage());
      sendEvent(12, { stage: this.stage });
    }
  }

  getItem(item) {
    // 아이템 획득시 점수 변화
    this.score += item.itemScore;
  }

  reset() {
    this.stage = 1000;
    this.nextStageScore = 100;
    this.score = 0;
    this.scorePerSec = 1;
    this.stageChange = true;
  }

  setNextStage(nextStage) {
    this.stage = nextStage.id;
    this.nextStageScore = nextStage.nextStageScore;
    this.scorePerSec = nextStage.scorePerSecond;
    this.stageChange = true;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;