import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionCodes } from './constants/exception-codes.enum';
import { ExceptionMessages } from './constants/exception-messages';
import { UnknownException } from './unknown.exception';

export class ExceptionFactory {
  static create(code: ExceptionCodes, message?: string): HttpException {
    let exception: HttpException;

    switch (code) {
      case ExceptionCodes.DOCUMENT_NOT_FOUND:
        exception = new NotFoundException(
          message || ExceptionMessages.DATABASE.DOCUMENT_NOT_FOUND,
        );
        break;
      case ExceptionCodes.USER_NOT_FOUND:
        exception = new NotFoundException(
          message || ExceptionMessages.USER.NOT_FOUND,
        );
        break;
      case ExceptionCodes.INVALID_PASSWORD:
        exception = new ConflictException(
          message || ExceptionMessages.VALIDATE.INVALID_PASSWORD,
        );
        break;
      case ExceptionCodes.PASSWORD_TOO_SHORT:
        exception = new ConflictException(
          message || ExceptionMessages.VALIDATE.PASSWORD_TOO_SHORT,
        );
        break;
      case ExceptionCodes.BAD_REQUEST:
        exception = new BadRequestException(
          message || ExceptionMessages.BAD_REQUEST,
        );
        break;
      case ExceptionCodes.UNAUTHORIZED:
        exception = new UnauthorizedException(
          message || ExceptionMessages.UNAUTHORIZED,
        );
        break;
      case ExceptionCodes.UNKNOWN:
      default:
        exception = new UnknownException(message || ExceptionMessages.UNKNOWN);
    }

    return exception;
  }
}
