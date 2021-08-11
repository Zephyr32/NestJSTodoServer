import {
  Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as path from 'path';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const bearerToken = request.headers.authorization;
    if (bearerToken === 'null' || !bearerToken) {
      throw new UnauthorizedException();
      return true;
    }

    const token = bearerToken.replace('Bearer ', '');
    if (!token) {
      return false;
    }
    console.log('bearerToken', bearerToken);

    return this.authService.validateToken(token);
  }
}
