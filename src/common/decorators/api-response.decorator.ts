import { AppResponseDto } from '@common/dtos/app.response.dto';
import { MetaResponseDto } from '@common/dtos/meta.response.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';

export const ApiResponse = <T>(dto: ClassConstructor<T>) => {
  return applyDecorators(
    ApiExtraModels(AppResponseDto<T>, dto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponseDto<T>) },
          {
            properties: {
              meta: {
                type: 'object',
                items: { $ref: getSchemaPath(MetaResponseDto) },
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
            },
          },
        ],
      },
    }),
  );
};
