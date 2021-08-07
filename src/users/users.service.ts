import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserDto,
  User,
  UserDocument,
  UserDto,
} from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(
    userDto: CreateUserDto,
  ): Promise<{ user: UserDto; activationLink: string }> {
    const activationLink = randomUUID();
    const hashPassword = await bcrypt.hash(userDto.password, 3);

    return {
      user: new UserDto(
        await this.userModel.create({
          email: userDto.email,
          password: hashPassword,
          name: userDto.name,
          activationLink,
        }),
      ),
      activationLink,
    };
  }

  async FindOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email });
  }
}
