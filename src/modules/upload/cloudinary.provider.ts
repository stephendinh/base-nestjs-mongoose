import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
export const CLOUDINARY = 'Cloudinary';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (config: ConfigService) => {
    return v2.config({
      cloud_name: config.get('CLOUDINARY_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
