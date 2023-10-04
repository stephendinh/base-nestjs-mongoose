import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { FindAllOrderDto } from '../dtos/find-all-order.dto';
import { response } from '@modules/shared/transforms/responses.transform';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { OrderResponseDto } from '../dtos/order-response';
import { ETypeOfTime } from '../interfaces';
@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<any> {
    const { shippingAddress, subTotal, shippingFree, items, paymentMethod } =
      createOrderDto;
    console.log('createOrderDto', createOrderDto);
    await this.orderRepo.create({
      shippingAddress,
      subTotal,
      shippingFree,
      items,
      paymentMethod,
      user: userId,
    });
    return {
      message: 'Order created successfully',
      success: true,
    };
  }

  async updateOrderStatus(
    updateStatusDto: UpdateOrderStatusDto,
    orderId: string,
  ): Promise<any> {
    await this.orderRepo.update(orderId, {
      status: updateStatusDto.status,
    });
    return {
      message: 'Update order status successfully',
      success: true,
    };
  }

  async getAllUserOrders(
    query: FindAllOrderDto,
    options: QueryOptionsRequestDto,
  ): Promise<AppResponseDto<OrderResponseDto[]>> {
    const orderPagination = await this.orderRepo.paginate(query, options);
    return response(
      { plain: orderPagination.data, cls: OrderResponseDto },
      { pagination: orderPagination.spec, description: 'description' },
    );
  }

  async totalOrderUserByTime(userId: string, typeOfTime: ETypeOfTime) {
    return this.orderRepo.totalOrderUserByTime(userId, typeOfTime);
  }
}
