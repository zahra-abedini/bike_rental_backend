import { Controller, Post, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post(':rentalId')
  pay(@Param('rentalId') id: number) {
    return this.paymentService.pay(Number(id));
  }
}
