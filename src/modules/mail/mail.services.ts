import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({
    to,
    subject,
    text,
  }: {
    to: string;
    subject: string;
    text: string;
  }): Promise<any> {
    const rs = await this.mailerService.sendMail({
      to,
      subject,
      from: 'noreply@nestjs.com',
      text,
    });
    return rs;
  }
}
