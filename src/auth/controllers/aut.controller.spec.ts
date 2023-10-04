import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from '@modules/mail/interfaces';
import { UsersModule } from '@modules/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { AuthService } from '@auth/services/auth.services';
import { RedisCacheModule } from '@modules/redis/redis.module';
import { MailModule } from '@modules/mail/mail.module';
import { MongooseAppModule } from '@database/mongodb/mongodb.module';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const requestFailLoginMock = {
    email: 'dinhvanchuong2k@gmail.com',
    password: 'chuong123111',
  };
  const registrationData = {
    email: 'rooney@gmail.com',
    password: 'chuong123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          expandVariables: true,
        }),
        MongooseAppModule,
        PassportModule.register({
          defaultStrategy: 'jwt',
          property: 'user',
          session: false,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
          }),
          inject: [ConfigService],
        }),
        BullModule.registerQueue({
          name: MAIL_QUEUE.NAME,
        }),
        UsersModule,
        RedisCacheModule,
        MailModule,
      ],
      providers: [JwtStrategy, AuthService],
      controllers: [AuthController],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should throw the BadRequestException when wrong user name or password', () => {
      return expect(() =>
        controller.login(requestFailLoginMock),
      ).rejects.toThrow(BadRequestException);
    });
    it('it should return user when enter correct username and password', async () => {
      const result = await controller.login(registrationData);
      expect(result.data.email).toBe(registrationData.email);
    });
  });
});
