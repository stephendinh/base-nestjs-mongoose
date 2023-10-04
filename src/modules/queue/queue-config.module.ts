import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueConfigProvider } from './queue-config.provider';

@Module({
  imports: [
    BullModule.forRootAsync({ useClass: QueueConfigProvider }),
    BullModule.registerQueue({ name: 'emailSending' }),
  ],
  exports: [BullModule],
})
export class QueueConfigModule {}
