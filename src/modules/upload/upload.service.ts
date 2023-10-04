import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { File } from 'fastify-multer/lib/interfaces';

@Injectable()
export class UploadService {
  async uploadFile(
    file: File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || file.size === 0) {
      throw new BadRequestException('The file must not be empty');
    }
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
