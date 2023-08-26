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

@WebSocketGateway({
  path: '/logActive',
  cors: {
    origin: CLIENT_URL,
  },
  Credential: true,
})
/**
 * 소켓 연결 handshake시 클라이언트로 부터 JWT 토큰을 같이 받음
 * 받은 토큰의 유효성을 검사하여, 성공하면 mbId, 실패하면 값을 반환하지 않음
 * 소켓ID 키값에 mbid값 부여, 게이트웨이내 전역 멤버 변수로 보관함
 * 아이디값은 인증을 마친 아이디값이므로 해당 mbid값이 존재한다면,
 * 해당 id에 매핑되는 로그 파일의 읽기/쓰기 기능을 실행할 수 있게함
 */

@WebSocketGateway(CLIENT_PORT, { transports: ['websocket'] })
export class LogGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) { }

  private logger = new Logger('Gateway');

  afterInit() {
    this.logger.log('Socket server initialized ✅');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(
      `Socket ID [${socket.id}] connected successfully ⭕`,
    );
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    socket.disconnect();
    this.logger.log(
      `Socket ID [${socket.id}] disconnected ❌`,
    );
  }

  // 해당 아이디의 토큰 인증 후, 모든 로그 보내기
  @SubscribeMessage('serverExportAllLogs')
  async serverExportAllLogs(
    @ConnectedSocket() socket: Socket,
    @MessageBody() token: string,
  ) {
    try {
      const mbIdWithJWT = this.authService.validateUserByJwtToken(token);
      if (!mbIdWithJWT) {
        // socket.emit("clientLogMessage", "Invalid token");
        return;
      } else {
        const logAll = await readLogByMbId(mbIdWithJWT); // 로그 저장
        socket.emit("logAll", logAll); // 로그 저장 결과, 클라이언트에 전송
      }
    } catch (error) {
      // socket.emit("clientLogMessage", "Error occurred");
    }
  }

  // 서버 로그 메세지 저장 및 갱신
  @SubscribeMessage('serverLogMessage')
  async serverLogMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { message: string; token: string },
  ) {
    const { message, token } = body;
    try {
      const mbIdWithJWT = this.authService.validateUserByJwtToken(token);
      if (!mbIdWithJWT) {
        // socket.emit("clientLogMessage", "Invalid token");
        return;
      } else {
        await writeLogByMbId(mbIdWithJWT, message); // 로그 저장
        socket.emit("clientLogMessage", message); // 로그 저장 결과, 클라이언트에 전송
      }
    } catch (error) {
      // socket.emit("clientLogMessage", "Error occurred");
    }
  }
}
