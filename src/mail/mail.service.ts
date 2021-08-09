import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto, token: string) {
    const url = `http://localhost:3006/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to My App! Confirm your Email',
      html: `<p>Hey ${user.email},</p>
          <p>Please click below to confirm your email</p>

          <a href="${url}">Confirm</a>

      <p>If you did not request this email you can safely ignore it.</p>`,
      context: {
        name: user.name,
        url: url,
      },
    });
  }
}
