import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsValidPassword(validationOptions?: ValidationOptions): any {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isWalletAddressList',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, _args: ValidationArguments) {
          const password = String(value);
          if (!password) {
            throw ExceptionFactory.create(ExceptionCodes.INVALID_PASSWORD);
          }
          if (password.length < 8) {
            throw ExceptionFactory.create(ExceptionCodes.PASSWORD_TOO_SHORT);
          }
          return true;
        },
      },
    });
  };
}
