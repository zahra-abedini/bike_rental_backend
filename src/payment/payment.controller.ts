import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Payment } from './payment.entity';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post(':rentalId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'انجام عملیات پرداخت برای اجاره',
    description:
      'این متد شناسه اجاره را دریافت کرده و وضعیت آن را به پرداخت شده تغییر می‌دهد.',
  })
  @ApiParam({
    name: 'rentalId',
    description: 'شناسه (ID) رکوردی که قرار است پرداخت شود',
    example: 123,
  })
  @ApiResponse({
    status: 200,
    description: 'پرداخت با موفقیت انجام شد.',
    schema: {
      example: {
        message: 'Payment successful',
        transactionId: 'TXN-987654321',
        amount: 150000,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'رکورد اجاره با این شناسه پیدا نشد.',
  })
  @ApiResponse({
    status: 400,
    description: 'این اجاره قبلاً پرداخت شده است یا مشکلی در تراکنش وجود دارد.',
  })
  pay(@Param('rentalId') id: number) {
    return this.paymentService.pay(Number(id));
  }

  @Get() // آدرس: GET /payment
  @ApiOperation({ summary: 'مشاهده لیست تمام تراکنش‌های مالی' })
  @ApiResponse({
    status: 200,
    description: 'لیست پرداخت‌ها دریافت شد.',
    type: [Payment], // برگرداندن آرایه‌ای از مدل Payment
  })
  findAll() {
    return this.paymentService.findAll();
  }
}
