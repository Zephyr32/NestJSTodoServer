import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleTokenConnect } from './entities/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { ModuleUserConnect } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService],
  imports: [
    MongooseModule.forFeature([ModuleTokenConnect]),
    MongooseModule.forFeature([ModuleUserConnect]),
    JwtModule.registerAsync({
      useFactory: (args: any) => ({
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '2h',
      }),
    }),
    MailModule,
    UsersModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
