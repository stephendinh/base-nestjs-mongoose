import { Injectable } from '@nestjs/common';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '@modules/shared/utils/password.util';
import { SendOtpDTO } from '@modules/users/dtos/verify-otp.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MAIL_QUEUE, Mail } from '@modules/mail/interfaces';
import { UsersService } from '@modules/users/services/users.service';
import { IGenerateTokenProps, JWTPayload } from '@auth/interfaces';
import { LoginDto } from '@auth/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue(MAIL_QUEUE.NAME) private readonly mailQueue: Queue,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    registerDto: CreateUserDto,
  ): Promise<AppResponseDto<UserResponseDto>> {
    const user = await this.userService.create(registerDto);
    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userService.findUserToLogin(email);
    if (!user) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `Username or password is not correct!`,
      );
    }

    const passwordVerified = await comparePassword(password, user.password);

    if (!passwordVerified) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `Username or password is not correct!`,
      );
    }

    const token = await this._generateToken({
      email: user.email,
    });
    await this.sendMailWelcome({
      to: user.email,
      text: 'Welcome you to login :/',
      subject: 'Welcome',
    });
    // await this.mailService.sendMail({
    //   to: user.email,
    //   text: 'Welcome you to login :/',
    //   subject: 'Welcome',
    // });
    return {
      data: user,
      token,
    };
  }

  async requestOTP(email: string): Promise<string> {
    const user = await this.userService.findUserToLogin(email);
    if (user.isVerified) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `Your account was verified!`,
      );
    }
    return await this.userService.requestOTP(email);
  }

  async sendMailWelcome(data: Mail) {
    const job = await this.mailQueue.add(MAIL_QUEUE.JOB, data);
    return { jobId: job.id };
  }

  async approveUserByOTP(
    sendOtp: SendOtpDTO,
    email: string,
    _id: string,
  ): Promise<any> {
    const isMatchingOTP = await this.userService.verifyOTP(sendOtp, email);
    if (!isMatchingOTP) {
      throw ExceptionFactory.create(
        ExceptionCodes.DOCUMENT_NOT_FOUND,
        'Your OTP is expired ',
      );
    }
    await this.userService.updateVerify(_id);
    return {
      message: 'Your account is verified ',
      isSuccess: true,
    };
  }

  async verifyUser(payload: JWTPayload): Promise<any> {
    const user = await this.userService.findUserToVerify(payload);
    if (!user) {
      throw ExceptionFactory.create(ExceptionCodes.UNAUTHORIZED);
    }

    return user;
  }

  private async _generateToken(
    generateToken: IGenerateTokenProps,
    exp?: any,
  ): Promise<string> {
    const { email } = generateToken;
    const defaultExpiresIn = process.env.JWT_EXPIRES || '20m';
    const expiresIn = exp || defaultExpiresIn;
    const user: JWTPayload = { email };
    const accessToken = this.jwtService.sign(user, { expiresIn: expiresIn });
    return accessToken;
  }
}
