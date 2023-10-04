import { User, UserDocument } from '@database/schemas/user.schema';
import { BaseRepository } from '@modules/shared/base/repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
  async findOneByConditions(
    conditions: FilterQuery<UserDocument> = {},
    projection?: ProjectionType<UserDocument>,
  ): Promise<UserDocument> {
    const document = await this.userModel.findOne(
      { ...conditions, deletedAt: null },
      projection,
      { lean: true },
    );
    return document as UserDocument;
  }
}
