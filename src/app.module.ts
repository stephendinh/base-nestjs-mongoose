import { AppCacheModule } from '@common/cache/app-cache.module';
import { HttpCacheInterceptor } from '@common/interceptors/http-cache.interceptor';
import { MongooseAppModule } from '@database/mongodb/mongodb.module';
import { SharedModule } from '@modules/shared/shared.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    MongooseAppModule,
    AppCacheModule,
    SharedModule,
    UsersModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor }],
})
export class AppModule {}
