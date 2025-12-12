import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('Please login to access this resource');
    }
    return true;
  }
}
