import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_PORT, CLIENT_URL } from 'src/config/config';
import { readLogByMbId } from 'src/lib/user.log.read';
import { writeLogByMbId } from 'src/lib/user.log.write';

// Socket Config Setting
@WebSocketGateway({
  path: '/logActive',
  cors: {
    origin: CLIENT_URL,
  },
  Credential: true,
})
// JWT 인증된 사용자만 로그 읽기/쓰기 가능
// 1.
// 1. 인증이 완료되면 연결된 소켓ID 키값에 mbid값 부여,
// 2. 해당 mbid값이 있으면, mbid와 매핑되는 로그파일에 접근 후 읽기/쓰기 방식

/**
 * 소켓 연결 handshake시 클라이언트로 부터 JWT 토큰을 같이 받음
 * 받은 토큰의 유효성을 검사하여, 성공하면 mbId, 실패하면 값을 반환하지 않음
 * 소켓ID 키값에 mbid값 부여, 게이트웨이내 전역 멤버 변수로 보관함
 * 아이디값은 인증을 마친 아이디값이므로 해당 mbid값이 존재한다면,
 * 해당 id에 매핑되는 로그 파일의 읽기/쓰기 기능을 실행할 수 있게함
 */

@WebSocketGateway(CLIENT_PORT, { transports: ['websocket'] })
export class LogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  // Logger Setting
  private logger = new Logger('Gateway');
  private connectedClients: Record<string, string> = {}; // Socket ID를 키로, mbId를 값으로 저장하는 객체

  afterInit() {
    this.logger.log('Socket server initialized ✅');
  }

  // Socket Connection Handling
  handleConnection(@ConnectedSocket() socket: Socket) {
    const token = Array.isArray(socket.handshake.query.token)
      ? socket.handshake.query.token[0]
      : socket.handshake.query.token;
    try {
      const mbId = this.authService.validateUserByJwtToken(token);
      if (!mbId) {
        socket.emit('connectionError', 'Authentication failed');
        return;
      }
      this.connectedClients[socket.id] = mbId; // 연결된 클라이언트 정보 저장
      this.logger.log(
        `Socket ID [${socket.id}] | Member ID [${mbId}] connected successfully ⭕`,
      );
    } catch (e) {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const mbId = this.connectedClients[socket.id]; // 연결이 끊긴 클라이언트의 mbId 가져오기
    delete this.connectedClients[socket.id]; // 연결 정보 삭제
    socket.disconnect();
    this.logger.log(
      `Socket ID [${socket.id}] | Member ID [${mbId}] disconnected ❌`,
    );
  }

  // 로그 기록 요청 처리 핸들러
  @SubscribeMessage('requestLog')
  async handleRequestLog(@ConnectedSocket() socket: Socket) {
    const mbId = this.connectedClients[socket.id]; // 연결된 클라이언트의 mbId 가져오기
    if (!mbId) {
      socket.emit('logContent', '');
      return;
    } else {
      const logContent = await readLogByMbId(mbId);
      socket.emit('logContent', logContent);
    }
  }

  // 로그 기록 쓰기 처리 핸들러
  @SubscribeMessage('writeLog')
  async handleWriteLog(
    @ConnectedSocket() socket: Socket,
    @MessageBody() logMessage: string,
  ) {
    const mbId = this.connectedClients[socket.id]; // 연결된 클라이언트의 mbId 가져오기
    if (!mbId) {
      socket.emit('logContent', '');
      return;
    } else {
      await writeLogByMbId(mbId, logMessage);
      socket.emit('logWritten', `Log written: ${logMessage}`);
    }
  }

  // 로그 커스텀 메세지 처리 핸들러
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    const mbId = this.connectedClients[socket.id]; // 연결된 클라이언트의 mbId 가져오기
    if (!mbId) {
      socket.emit('logContent', '');
      return;
    } else {
      socket.broadcast.emit('message: ', { username: socket.id, message });
      return { socketID: socket.id, message };
    }
  }
}
