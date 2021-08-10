import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  REFRESH_TOKEN,
  Token,
  TokenDocument,
  Tokens,
} from './entities/token.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  LoginUserDto,
  RegisterLoginReturn,
  User,
  UserDocument,
} from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  async registration(userData: CreateUserDto): Promise<RegisterLoginReturn> {
    const candidate = await this.usersService.FindOne(userData.email);
    if (candidate) {
      throw new Error(
        `Пользователь с почтовым адрессом ${userData.email} уже существует`,
      );
    }
    const { user, activationLink } = await this.usersService.createUser(
      userData,
    );

    await this.mailService.sendUserConfirmation(user, activationLink);

    const tokens = this.generateTokens({ id: user.id, email: user.email });

    await this.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
    };
  }
  async login(userData: LoginUserDto): Promise<RegisterLoginReturn> {
    const candidate = await this.usersService.FindOne(userData.email);
    if (!candidate)
      throw new Error(`Пользователь с таким почтовым адрессом не существует`);
    const isSame = await bcrypt.compare(userData.password, candidate.password);
    if (!isSame) throw new Error(`Пароль не верный`);
    const tokens = this.generateTokens({
      id: candidate.id,
      email: candidate.email,
    });
    await this.saveToken(candidate.id, tokens.refreshToken);
    return tokens;
  }
  async logout(token) {
    const data = this.jwtService.decode(token) as { id: string; email: string };
    if (!data.id) throw new Error(`Токен не существует`);
    await this.tokenModel.findOneAndDelete({ user: data.id });
  }
  async refreshToken(req: Request): Promise<Tokens> {
    const data = this.jwtService.decode(req.cookies[REFRESH_TOKEN]) as {
      id: string;
      email: string;
    };
    if (!data.id) throw new Error(`Токен не существует`);
    const dataBaseToken = await this.tokenModel.findOne({ user: data.id });
    console.log('dataBaseToken', dataBaseToken);
    console.log('cookies token', req.cookies[REFRESH_TOKEN]);
    if (!dataBaseToken?.refreshToken) throw new Error(`Токен не существует`);
    if (dataBaseToken.refreshToken !== req.cookies[REFRESH_TOKEN])
      throw new Error(`Фальшивка!!`);
    console.log('data', data);
    const user: UserDocument = await this.userModel.findOne({ _id: data.id });
    console.log('user', user);

    const newTokens = this.generateTokens({ id: user._id, email: user.email });
    await this.saveToken(user._id, newTokens.refreshToken);
    return newTokens;
  }

  generateTokens(payload: { id: string; email: string }): Tokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.jwt_access_secret,
      expiresIn: '2h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.jwt_refresh_secret,
      expiresIn: '2h',
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await this.tokenModel.create({ user: userId, refreshToken });
  }

  async validateToken(token: string): Promise<boolean> {
    const data = this.jwtService.decode(token) as {
      id: string;
      email: string;
    };
    if (!data?.id) {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
      return false;
    }
    const dataBaseToken = await this.tokenModel.findOne({ user: data.id });
    if (!dataBaseToken?.refreshToken) {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
      return false;
    }
    if (dataBaseToken.refreshToken !== token) {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
      return false;
    }
    return true;
  }
}
