import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('requests headers', request.headers);
    console.log('requests headers', request.headers.authorization);
    const bearerToken = request.headers.authorization;
    if (bearerToken === 'null') {
      throw new HttpException('', HttpStatus.UNAUTHORIZED);
      return false;
    }

    const token = bearerToken.replace('Bearer ', '');
    if (!token) {
      return false;
    }
    console.log('bearerToken', bearerToken);

    return this.authService.validateToken(token);
  }
}
