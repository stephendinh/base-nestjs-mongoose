import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FastifyFileInterceptor } from '@common/interceptors/fastify-file.interceptor';
import { File } from 'fastify-multer/lib/interfaces';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image to cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FastifyFileInterceptor('file'))
  async upload(
    @UploadedFile()
    file: File,
  ) {
    const image = await this.uploadService.uploadFile(file);
    return image.secure_url;
  }
}
