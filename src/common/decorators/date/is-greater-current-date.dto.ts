import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsGreaterThanCurrentDate(validateOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanCurrentDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validateOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          const inputDate = new Date(value);

          return inputDate > currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than the current date.`;
        },
      },
    });
  };
}
