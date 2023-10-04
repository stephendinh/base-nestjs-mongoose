import { Body, Controller, Post } from '@nestjs/common';
import { SocketGateway } from '../socket.gateway';
import { TestSocketDto } from '../dtos/test-socket.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketGateway: SocketGateway) {}

  @Post('test')
  async testSocket(@Body() testSocketDto: TestSocketDto) {
    console.log('testSocketDto', testSocketDto);
    return this.socketGateway.emitTo(testSocketDto);
  }
}
