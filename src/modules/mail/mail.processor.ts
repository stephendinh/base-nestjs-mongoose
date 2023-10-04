import { Process, Processor } from '@nestjs/bull';
import { MailService } from './mail.services';
import { MAIL_QUEUE, Mail } from './interfaces';
import { Job } from 'bull';

@Processor(MAIL_QUEUE.NAME)
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}
  @Process(MAIL_QUEUE.JOB)
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;
    console.log('runhere');
    await this.mailService.sendMail({
      ...data,
    });
  }
}
