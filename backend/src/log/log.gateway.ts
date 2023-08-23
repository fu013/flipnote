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
import { CLIENT_PORT } from 'src/config/config';
import { readLogByMbId } from 'src/lib/user.log.read';
import { writeLogByMbId } from 'src/lib/user.log.setting';

// Socket Config Setting
@WebSocketGateway({
  path: '/logActive',
  cors: {
    origin: '*',
  },
  Credential: true,
})
@WebSocketGateway(CLIENT_PORT, { transports: ['websocket'] })
export class LogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // Logger Setting
  private logger = new Logger('Gateway');

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  // Socket Connection Setting
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 성공`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  // 로그 기록 요청 처리 핸들러
  @SubscribeMessage('requestLog')
  async handleRequestLog(@ConnectedSocket() socket: Socket) {
    const mbId = 'root';
    const logContent = await readLogByMbId(mbId);
    socket.emit('logContent', logContent);
  }

  // 로그 기록 쓰기 처리 핸들러
  @SubscribeMessage('writeLog')
  async handleWriteLog(
    @ConnectedSocket() socket: Socket,
    @MessageBody() logMessage: string,
  ) {
    const mbId = 'root';
    await writeLogByMbId(mbId, logMessage);
    socket.emit('logWritten', `Log written: ${logMessage}`);
  }

  // 로그 커스텀 메세지 처리 핸들러
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    socket.broadcast.emit('message: ', { username: socket.id, message });
    return { username: socket.id, message };
  }
}
