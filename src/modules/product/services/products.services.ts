import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/products.repository';
import { CreateProductDto } from '../dtos/product.dto';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { response } from '@modules/shared/transforms/responses.transform';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { FindAllProductDto } from '../dtos/find-all-products.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { RedisCacheService } from '@modules/redis/redis.service';
import { MailService } from '@modules/mail/mail.services';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly cacheService: RedisCacheService,
    private readonly mailService: MailService,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const { shortBio, brand, name, description } = createProductDto;
    const product = await this.productRepo.findOneByConditions({
      name,
    });

    if (product) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `product with name ${name} already exists`,
      );
    }

    const newProduct = await this.productRepo.create({
      shortBio,
      brand,
      description,
      name,
    });
    await this.mailService.sendMail({
      to: 'dinhvanchuong2k@gmail.com',
      subject: 'Product announce',
      text: 'Admin has created a new product',
    });
    return response({ plain: newProduct, cls: ProductResponseDto });
  }

  async findProductById(
    id: string,
  ): Promise<AppResponseDto<ProductResponseDto>> {
    const cachedKey = `product-detail-${id}`;
    const cachedData = await this.cacheService.get(cachedKey);
    const expiration = 15 * 60;
    if (!cachedData) {
      const product = await this.productRepo.findOneById(id);
      await this.cacheService.set(
        cachedKey,
        response({ plain: product, cls: ProductResponseDto }),
        expiration,
      );
      return response({ plain: product, cls: ProductResponseDto });
    }
    // const cachedData = await this.cacheService.get(cachedKey);

    return cachedData;
  }

  async findProducts(
    query: FindAllProductDto,
    options: QueryOptionsRequestDto,
  ): Promise<AppResponseDto<ProductResponseDto[]>> {
    const productsPagination = await this.productRepo.paginate(query, options);
    return response(
      { plain: productsPagination.data, cls: ProductResponseDto },
      { pagination: productsPagination.spec, description: 'description' },
    );
  }
}
