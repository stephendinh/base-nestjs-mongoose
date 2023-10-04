import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './jobSchedule.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class JobSchedule {}
