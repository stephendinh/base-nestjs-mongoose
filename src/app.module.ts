import { AppCacheModule } from '@common/cache/app-cache.module';
import { HttpCacheInterceptor } from '@common/interceptors/http-cache.interceptor';
import { MongooseAppModule } from '@database/mongodb/mongodb.module';
import { SharedModule } from '@modules/shared/shared.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadModule } from '@modules/upload/upload.module';
import { ProductModule } from '@modules/product/product.module';
import { RedisCacheModule } from '@modules/redis/redis.module';
import { MailModule } from '@modules/mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from '@modules/socket/socket.module';
import { BullModule } from '@nestjs/bull';
import { DiscountModule } from '@modules/discount/discount.module';
import { JobSchedule } from '@modules/jobSchedule/jobSchedule.module';
import OrderModule from '@modules/order/order.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: false,
          removeOnFail: false,
          attempts: 3,
        },
      }),
      inject: [ConfigService],
    }),
    JobSchedule,
    AuthModule,
    RedisCacheModule,
    UploadModule,
    MongooseAppModule,
    SocketModule,
    MailModule,
    AppCacheModule,
    SharedModule,
    UsersModule,
    ProductModule,
    DiscountModule,
    OrderModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
    AppService,
  ],
})
export class AppModule {}
