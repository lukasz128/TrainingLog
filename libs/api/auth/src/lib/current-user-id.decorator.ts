import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './auth.types';

/**
 * Returns the authenticated user's id (`sub` claim of the JWT).
 * Must be used on routes protected by `AuthGuard`.
 */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  },
);
