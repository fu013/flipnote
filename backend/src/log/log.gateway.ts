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
 * 소켓 연결 handshake시 클라이언트와 인증 없이 연결(연결 시작부터 토큰 인증을 받으려면 구조상 굉장히 돌아가야 하므로, 채택하지 않음)
 * 로그 GET/SET 관련 소켓 메세지가 날라오면 JWT 토큰을 인증함
 * JWT 토큰 인증이 성공하면, 토큰에 매칭된 회원 아이디값을 추출,
 * 해당 아이디값으로 로그 GET/SET 후 정보를 회원 소켓에게 전달
 * JWT 토큰 인증 실패시, 오류 소켓 메세지 전달 후, disconnect
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
