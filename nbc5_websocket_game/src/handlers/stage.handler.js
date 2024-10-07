import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';

export const moveStageHandler = (userId, payload) => {
  const { stages } = getGameAssets();
  
  if (!stages.data.length - 1 === payload.targetStage) {
    return { status: 'fail', message: 'The current stage is the Max stage' };
  }
  
// 유저의 현재 스테이지 배열을 가져오고, 최대 스테이지 ID를 찾는다.
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user from moveStageHandler' };
  }

  // 오름차순 정렬 후 가장 큰 스테이지 ID 확인 = 가장 상위의 스테이지 = 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // payload 의 currentStage 와 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000; // 초 단위로 계산  

  // ex `1`스테이지 -> `2`스테이지로 넘어가는 가정
  // 1초당 1점, 100점이상 다음스테이지 이동, 오차범위 5
  // 클라이언트와 서버 간의 통신 지연시간을 고려해서 오차범위 설정
  // elapsedTime 은 100 이상 105 이하 일 경우만 통과  
  if (elapsedTime < currentStage.nextStageScore || elapsedTime > currentStage.nextStageScore + 0.5) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 게임 에셋에서 다음 스테이지의 존재 여부 확인  
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not exist' };
  }

  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  const stage = stages.data.find((stage) => stage.id === payload.targetStage);
  setStage(userId, stage.id, serverTime, stage.scorePerSecond);
  console.log('Stage:', getStage(userId));
  return { type: 'stage', status: 'success', message: 'Stage server update successfully', stage};
};