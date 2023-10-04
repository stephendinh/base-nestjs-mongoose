import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../services/products.services';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/product.dto';
import { ProductItemService } from '../services/product-item-sevices';
import { CreateProductItemDto } from '../dtos/add-product-item.dto';
import { FindAllProductDto } from '../dtos/find-all-products.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { HasRoles } from '@common/decorators/has-role.decorator';
import { EUserRoles } from '@database/schemas/types/roles.enum';
import { RoleGuard } from 'src/auth/guards/roles.guard';

@ApiTags('products')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, VerifiedAccount)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private readonly productItemService: ProductItemService,
  ) {}

  @HasRoles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post(':id/add-item')
  async addItem(
    @Param('id') id: string,
    @Body() createProductItemDto: CreateProductItemDto,
  ) {
    return this.productItemService.create(createProductItemDto, id);
  }

  @HasRoles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Find product by id' })
  @Get(':id')
  async findProductByName(@Param('id') id: string) {
    const product = this.productsService.findProductById(id);
    return product;
  }

  @ApiOperation({ summary: 'Find all product' })
  @Get()
  async findAllProducts(
    @Query() query: FindAllProductDto,
    @Query() options: QueryOptionsRequestDto,
  ) {
    const product = this.productsService.findProducts(query, options);
    return product;
  }
}
