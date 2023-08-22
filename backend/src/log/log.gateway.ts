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
import { Namespace, Socket } from 'socket.io';


@WebSocketGateway({
  path: '/logActive',
  cors: {
    origin: "*",
  },
  Credential: true,
})

@WebSocketGateway(28000, { transports: ['websocket'] })
export class LogGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('Gateway');

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`소켓 연결`);
    socket.broadcast.emit('message', {
      message: `${socket.id}가 들어왔습니다.`,
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ) {
    console.log(message);
    socket.broadcast.emit('message', { username: socket.id, message });
    return { username: socket.id, message };
  }
}