import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class VerifiedAccount implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req; // Assuming you have a user object with an id

    // Check if the user is verified
    if (user && user.isVerified) {
      return true; // Allow access
    }
    throw ExceptionFactory.create(
      ExceptionCodes.UNAUTHORIZED,
      'User has not been verified!',
    ); // Deny access
  }
}
