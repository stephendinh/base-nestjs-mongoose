import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronJobService {
  @Cron(CronExpression.EVERY_MINUTE)
  openForBusiness() {}
}
