import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ERoomEvents } from './interfaces';
import { JoinRoomInput } from './dtos/join-room.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@WebSocketGateway(parseInt(process.env.SOCKET_PORT), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server = null;
  constructor() {
    console.log(parseInt(process.env.SOCKET_PORT));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(server: Server): Promise<void> {
    console.log('Socket running at: ', process.env.SOCKET_PORT);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage(ERoomEvents.JOIN_ROOM)
  async joinRoom(client: Socket, payload: JoinRoomInput): Promise<string> {
    //todo check access token if room is private room
    console.log('runhere');
    console.log(`Client ${client.id} join room : ${payload.room}`);
    await client.join(payload.room);
    return '';
  }

  @SubscribeMessage('hello')
  async testRoom(client: Socket, payload: { data: string }) {
    console.log('hello roon');
    return payload.data;
  }

  @SubscribeMessage(ERoomEvents.LEAVE_ROOM)
  async leaveRoom(client: Socket, payload: { room: string }): Promise<string> {
    await client.leave(payload.room);
    return payload.room;
  }

  emitTo(payload: { id?: string; data: any; mEvent?: string }): any {
    const { id, data, mEvent } = payload;
    console.log('payload11', payload);
    if (id) {
      console.log('===============================');
      console.log('EMIT EVENT TO: ', id);
      console.log('EVENT: ', mEvent);
      console.log('===============================');

      return this.server.sockets.to(id).emit(mEvent, data);
    }

    if (mEvent) {
      return this.server.sockets.emit(mEvent, data);
    }

    return this.server.sockets.emit(data);
  }

  getServer(): Server {
    return this.server;
  }
}
