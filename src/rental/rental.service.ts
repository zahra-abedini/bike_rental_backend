import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './rental.entity';
import { Bike } from 'src/bike/bike.entity';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepo: Repository<Rental>,
    @InjectRepository(Bike)
    private bikeRepo: Repository<Bike>,
  ) {}

  async startRental(userId: number, bikeId: number) {
    const bike = await this.bikeRepo.findOneBy({ id: bikeId });

    if (!bike || bike.status !== 'available') {
      throw new Error('Bike not available');
    }

    bike.status = 'rented';
    await this.bikeRepo.save(bike);

    return this.rentalRepo.save({
      user_id: userId,
      bike_id: bikeId,
      start_time: new Date(),
    });
  }

  async endRental(rentalId: number) {
    const rental = await this.rentalRepo.findOneBy({ id: rentalId });
    if (!rental) throw new Error('Rental not found');
    if (rental.status !== 'ongoing') throw new Error('Rental already finished');

    rental.end_time = new Date();
    rental.status = 'finished';

    // محاسبه مدت زمان بر حسب دقیقه
    const durationMinutes = Math.ceil(
      (rental.end_time.getTime() - rental.start_time.getTime()) / 60000,
    );

    const ratePerMinute = 1; // مثلا ۱ واحد پولی در دقیقه
    rental.cost = durationMinutes * ratePerMinute;

    // آزاد کردن دوچرخه
    const bike = await this.bikeRepo.findOneBy({ id: rental.bike_id });
    if (bike) {
      bike.status = 'available';
      await this.bikeRepo.save(bike);
    }

    return this.rentalRepo.save(rental);
  }
}
