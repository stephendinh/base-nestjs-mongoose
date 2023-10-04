import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketController } from './controllers/socket.controller';

@Global()
@Module({
  controllers: [SocketController],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
