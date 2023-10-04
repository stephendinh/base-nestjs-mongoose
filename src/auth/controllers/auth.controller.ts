import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { SendOtpDTO } from '@modules/users/dtos/verify-otp.dto';
import { AuthService } from '@auth/services/auth.services';
import { VerifiedAccount } from '@auth/guards/verified-user.guard';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { IGetUserAuthInfoRequest } from '@auth/interfaces';
import { LoginDto } from '@auth/dtos/login.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'api for test connection' })
  // @HasRoles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, VerifiedAccount)
  @Get('checking')
  async checking(@Req() request: IGetUserAuthInfoRequest) {
    const { user } = request;
    return user;
  }

  @ApiOperation({ summary: 'Sign up' })
  @Post('signup')
  async signup(
    @Body() registerDto: CreateUserDto,
  ): Promise<AppResponseDto<UserResponseDto>> {
    return this.authService.signUp(registerDto);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AppResponseDto<any>> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request otp for verify' })
  @UseGuards(JwtAuthGuard)
  @Get('request-verify-otp')
  async requestOtp(@Req() request: IGetUserAuthInfoRequest) {
    const { user } = request;
    return this.authService.requestOTP(user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'request otp' })
  @UseGuards(JwtAuthGuard)
  @Post('send-otp')
  async sendOTP(
    @Req() request: IGetUserAuthInfoRequest,
    @Body() sendOtpDto: SendOtpDTO,
  ): Promise<AppResponseDto<any>> {
    const { user } = request;
    return this.authService.approveUserByOTP(sendOtpDto, user.email, user._id);
  }
}
