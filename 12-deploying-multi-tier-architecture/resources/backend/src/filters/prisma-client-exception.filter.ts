import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.code) {
      case 'P2025': {
        response.status(400).json({
          message: 'Resource not found',
          statusCode: HttpStatus.BAD_REQUEST,
        });
        break;
      }
      case 'P2002': {
        response.status(400).json({
          message: 'Resource already exists',
          statusCode: HttpStatus.BAD_REQUEST,
        });
        break;
      }
      default:
        super.catch(exception, host);
        break;
    }
  }
}
