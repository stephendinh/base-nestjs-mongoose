import { UserStatus } from '@database/schemas/types/user-status.enum';
import { response } from '@modules/shared/transforms/responses.transform';
import { Injectable } from '@nestjs/common';
import { FindAllUsersDto } from '../dtos/find-all-users.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UsersRepository } from '../repositories/users.repository';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

  async userExists(email: string): Promise<AppResponseDto<boolean>> {
    const userExist = await this.usersRepository.isExist({
      email,
      status: UserStatus.ACTIVE,
    });
    return response(userExist);
  }
}
