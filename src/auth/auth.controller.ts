import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes()
  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log('registration', userDto);
      const { refreshToken, accessToken } = await this.authService.registration(
        userDto,
      );
      res.cookie('refreshToken', refreshToken);
      return res.status(200).json({ accessToken });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/login')
  async LogIn(
    @Body() userDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log('login', userDto);
      console.log('login');
      const { refreshToken, accessToken } = await this.authService.login(
        userDto,
      );
      res.cookie('refreshToken', refreshToken);
      return res.status(200).json({ accessToken });
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/logout')
  async Logout(@Body() body: any, @Req() req: Request) {
    try {
      await this.authService.logout(req.headers.authorization);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/activate/:link')
  activate(@Param('link') link: string) {}

  @Get('/refresh/')
  refresh() {
    return 'blblblblbl';
  }
}
