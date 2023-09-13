import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class UnknownException extends HttpException {
  constructor(
    response: string | Record<string, any>,
    options?: HttpExceptionOptions,
  ) {
    super(response, 520, options);
  }
}
