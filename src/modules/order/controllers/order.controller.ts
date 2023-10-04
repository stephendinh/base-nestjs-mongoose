import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { VerifiedAccount } from 'src/auth/guards/verified-user.guard';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '@common/decorators/has-role.decorator';
import { EUserRoles } from '@database/schemas/types/roles.enum';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { OnlyIDParamDTO } from '@common/dtos/only-params-id.dto';
import { IGetUserAuthInfoRequest } from 'src/auth/interfaces';
import { FindAllOrderDto } from '../dtos/find-all-order.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { OrderFilterDTO } from '../dtos/order-filter.dto';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, VerifiedAccount)
  @Post()
  async createOrder(
    @Req() req: IGetUserAuthInfoRequest,
    @Body() createOrder: CreateOrderDto,
  ) {
    const { user } = req;
    return this.orderService.createOrder(createOrder, user._id);
  }

  @HasRoles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id/update-status')
  async updateStatus(
    @Param() params: OnlyIDParamDTO,
    @Body() updateStatusOrder: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(updateStatusOrder, params.id);
  }

  @HasRoles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  async getAllOrders(
    @Query() query: FindAllOrderDto,
    @Query() options: QueryOptionsRequestDto,
  ) {
    return this.orderService.getAllUserOrders(query, options);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/total-user-bough')
  async totalOrderUserByTime(
    @Req() req: IGetUserAuthInfoRequest,
    @Query() filter: OrderFilterDTO,
  ) {
    const { user } = req;
    return this.orderService.totalOrderUserByTime(user._id, filter.typeOfTime);
  }
}
