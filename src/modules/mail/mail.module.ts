import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.services';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from './interfaces';
import { MailProcessor } from './mail.processor';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'), // Your email address
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No reply" <${config.get('')}>`,
        },
        // template: {
        //   dir: join(__dirname, 'src/templates/email'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE.NAME,
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
