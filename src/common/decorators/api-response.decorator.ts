import { AppResponseDto } from '@common/dtos/app.response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';

export const ApiResponse = <T>(
  type: Array<T> | (() => void) | ClassConstructor<T>,
): MethodDecorator => {
  const data = new Object();
  const extraModels: Array<any> = [AppResponseDto<T>];
  switch (type) {
    case String:
      data['type'] = 'string';
      break;
    case Number:
      data['type'] = 'integer';
      break;
    case Boolean:
      data['type'] = 'boolean';
      break;
    case Object:
      data['type'] = 'object';
      break;
    case Array:
      data['type'] = 'array';
      data['items'] = { $ref: undefined };
      break;
    default:
      if (type.length) {
        data['type'] = 'array';
        data['items'] = { $ref: getSchemaPath(type[0] as ClassConstructor<T>) };
        extraModels.push(type);
      } else {
        data['$ref'] = getSchemaPath(type as ClassConstructor<T>);
        extraModels.push(type);
      }
  }

  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto<T>) },
          {
            properties: {
              data,
            },
          },
        ],
      },
    }),
  );
};
