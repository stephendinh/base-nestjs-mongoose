import { UserStatus } from '@database/schemas/types/user-status.enum';
import { response } from '@modules/shared/transforms/responses.transform';
import { Injectable } from '@nestjs/common';
import { FindAllUsersDto } from '../dtos/find-all-users.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UsersRepository } from '../repositories/users.repository';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { hashPassword } from '@modules/shared/utils/password.util';
import { UserDocument } from '@database/schemas/user.schema';
import { RedisCacheService } from '@modules/redis/redis.service';
import _generateOTP from '@modules/shared/utils/generateOTP';
import { redisCacheKey } from '@modules/redis/redisCache.key';
import * as dayjs from 'dayjs';
import { SendOtpDTO } from '../dtos/verify-otp.dto';
import { MailService } from '@modules/mail/mail.services';
import { JWTPayload } from 'src/auth/interfaces';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cacheService: RedisCacheService,
    private readonly mailService: MailService,
  ) {}

  async create(
    createUser: CreateUserDto,
  ): Promise<AppResponseDto<UserResponseDto>> {
    const { email, password, lastName, firstName } = createUser;
    const user = await this.usersRepository.findOneByConditions({ email });

    if (user) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `User with email ${email} already exists`,
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.usersRepository.create({
      email,
      password: hashedPassword,
      lastName,
      firstName,
    });

    return response({ plain: newUser, cls: UserResponseDto });
  }

  async findAllUsers(
    query: FindAllUsersDto,
    options: QueryOptionsRequestDto,
  ): Promise<AppResponseDto<UserResponseDto[]>> {
    const usersPagination = await this.usersRepository.paginate(query, options);
    return response(
      { plain: usersPagination.data, cls: UserResponseDto },
      { pagination: usersPagination.spec, description: 'description' },
    );
  }

  async findUserByEmail(
    email: string,
  ): Promise<AppResponseDto<UserResponseDto>> {
    const user = await this.usersRepository.findOneByConditions({
      email,
      status: UserStatus.ACTIVE,
    });
    return response({ plain: user, cls: UserResponseDto });
  }

  async findUserToLogin(email: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOneByConditions({
      email,
    });
    return user;
  }

  async userExists(email: string): Promise<AppResponseDto<boolean>> {
    const userExist = await this.usersRepository.isExist({
      email,
      status: UserStatus.ACTIVE,
    });
    return response(userExist);
  }

  async requestOTP(email: string): Promise<any> {
    const cacheKeyString = redisCacheKey.users.authorizedUser_otp + email;
    const generateOTP = _generateOTP(6);
    const cachingTime = 60 * 5;
    const date = new Date();
    const cachedData = await this.cacheService.get(cacheKeyString);
    const cacheValue = {
      otp: generateOTP,
      expiresAt: dayjs(date.setSeconds(date.getSeconds() + cachingTime)).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    };

    if (!cachedData) {
      await this.cacheService.set(cacheKeyString, cacheValue, cachingTime);
      await this.mailService.sendMail({
        to: email,
        subject: 'Verify OTP',
        text: `Your code OTP is ${cacheValue.otp} and expires at ${cacheValue.expiresAt}`,
      });
      return {
        message: 'Your OTP was sent to your email',
        expiresAt: cacheValue.expiresAt,
      };
    }
    return {
      message: 'Your OTP was sent to your email',
      expiresAt: cacheValue.expiresAt,
    };
  }

  async verifyOTP(sendOtp: SendOtpDTO, email: string): Promise<any> {
    const cacheKeyString = redisCacheKey.users.authorizedUser_otp + email;
    const cachedData = await this.cacheService.get(cacheKeyString);
    if (!cachedData) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        'Your OTP was expired or not exist!',
      );
    }
    if (sendOtp.opt !== cachedData.otp) {
      return false;
    }

    return true;
  }

  async updateVerify(_id: string): Promise<boolean> {
    const user = await this.usersRepository.update(
      _id,
      { isVerified: true },
      true,
    );
    return !!user;
  }

  async findUserToVerify(payload: JWTPayload): Promise<UserDocument> {
    const { email } = payload;
    return this.usersRepository.findOneByConditions({ email });
  }
}
