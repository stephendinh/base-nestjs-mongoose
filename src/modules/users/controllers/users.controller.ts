import { CacheKey } from '@nestjs/cache-manager';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllUsersDto } from '../dtos/find-all-users.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UsersService } from '../services/users.service';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { ApiResponse } from '@common/decorators/api-response.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'find all users' })
  @ApiResponse(UserResponseDto)
  @CacheKey('find-all-users')
  @Get()
  async findAllUsers(
    @Query() query: FindAllUsersDto,
    @Query() options: QueryOptionsRequestDto,
  ): Promise<AppResponseDto<UserResponseDto[]>> {
    const users = this.usersService.findAllUsers(query, options);
    return users;
  }

  @ApiOperation({ summary: 'find user by email' })
  //@ApiResponse({ type: UserResponseDto })
  @CacheKey('find-user-by-email')
  @Get(':email')
  async findUserByEmail(
    @Param('email') email: string,
  ): Promise<AppResponseDto<UserResponseDto>> {
    const user = this.usersService.findUserByEmail(email);
    return user;
  }

  @ApiOperation({ summary: 'Check user is exist' })
  //@ApiResponse({ type: Boolean })
  @Get('exists/:email')
  async userExists(
    @Param('email') email: string,
  ): Promise<AppResponseDto<boolean>> {
    const user = this.usersService.userExists(email);
    return user;
  }
}
