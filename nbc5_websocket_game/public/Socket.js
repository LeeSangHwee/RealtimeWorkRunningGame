// 클라이언트 버전 파일 가져오기
import { CLIENT_VERSION } from './constants.js';
import { handleEvent } from './handlers/response.handler.js';

// 소켓에 해당 주소로 연결하겠다
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

// 유저 아이디 null로 초기화
let userId = null;

// 어떠한 메시지들은 다 response를 통해서 갖게된다.
socket.on('response', (data) => handleEvent(data));

// connection 이라는 이벤트가 발생 했을때
// 유저 아이디에 uuid를 넣을 것이다.
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  
});

// event란 이름으로 메세지를 다 보내고
// 핸들러 아이디를 통해서 어떤 핸들러에서 처리가 될지 결정된다
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent };
