import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/entities/user.entity';
import Exception = Handlebars.Exception;
import { constants } from 'http2';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes()
  @Post('/registration')
  async registration(@Body() user: CreateUserDto) {
    try {
      return await this.authService.registration(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  LogIn(@Body() body: LoginUserDto) {
    try {
      return body;
    } catch (e) {}
  }

  @Post('/logout')
  Logout(@Body() body: any) {
    try {
      return body;
    } catch (e) {}
  }

  @Get('/activate/:link')
  activate(@Param('link') link: string) {}

  @Get('/refresh/')
  refresh() {
    return 'blblblblbl';
  }
}
