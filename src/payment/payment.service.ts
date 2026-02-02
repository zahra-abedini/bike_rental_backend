import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Rental } from 'src/rental/rental.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Rental)
    private rentalRepo: Repository<Rental>,
  ) {}

  async pay(rentalId: number) {
    const rental = await this.rentalRepo.findOneBy({ id: rentalId });

    if (!rental) {
      throw new Error('Rental not found');
    }

    const minutes = (Date.now() - rental.start_time.getTime()) / 60000;

    const cost = Math.ceil(minutes) * 2000;

    rental.end_time = new Date();
    rental.cost = cost;
    await this.rentalRepo.save(rental);

    return this.paymentRepo.save({
      rental_id: rentalId,
      amount: cost,
      status: 'success',
    });
  }
}
