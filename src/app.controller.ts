import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';

@ApiTags('')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async postHello() {
    console.log('runhere');
    return this.appService.handleWebhook();
  }
  @Post()
  async runhere(@Req() req: any, @Body() data: any) {
    console.log('handleWebhook', JSON.parse(data.payload));
    return this.appService.handleWebhook();
  }
}
