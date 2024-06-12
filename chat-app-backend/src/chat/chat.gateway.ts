import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = Array.isArray(client.handshake.query.userId)
      ? client.handshake.query.userId[0]
      : client.handshake.query.userId;

    if (userId) {
      client.join(userId); // Join a room with the userId
    } else {
      console.log('User ID not provided');
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() message: { receiverId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = Array.isArray(client.handshake.query.userId)
      ? client.handshake.query.userId[0]
      : client.handshake.query.userId;

    if (!senderId) {
      console.log('Sender ID not provided');
      return;
    }

    const { receiverId, content } = message;

    const chat = await this.chatService.createMessage(
      parseInt(senderId, 10),
      receiverId,
      content,
    );

    // Emit to the receiver's room and the sender's room
    this.server.to(receiverId.toString()).emit('message', chat);
    this.server.to(senderId.toString()).emit('message', chat);
  }
}
