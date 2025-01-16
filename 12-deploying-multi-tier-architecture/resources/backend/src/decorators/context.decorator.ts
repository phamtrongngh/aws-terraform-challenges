import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// Decorator that extracts the request context in controllers to get information like: user, roles, etc.
export const Context = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request;
  },
);
