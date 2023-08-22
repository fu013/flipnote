import { WebSocketGateway, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/logActive'
})

export class LogGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private wsClients: Set<any> = new Set(); // Set을 사용하여 중복 클라이언트를 피하도록 변경

  afterInit(): void {
    console.log('소켓 준비 완료');
  }

  // 클라이언트가 연결되었을 때 호출되는 메서드
  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
    this.wsClients.add(client);
  }

  // 클라이언트가 연결을 끊었을 때 호출되는 메서드
  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
    this.wsClients.delete(client);
  }

  // 클라이언트로부터 메시지를 받았을 때 호출되는 메서드
  @SubscribeMessage('message') // 'message' 이벤트를 수신하도록 설정
  handleMessage(client: any, message: string): void {
    console.log(`Received message from ${client.id}: ${message}`);
    // 클라이언트에게 동일한 메시지를 다시 보내기
    client.emit('message', message); // 해당 클라이언트에게 메시지를 보냄
  }

}
