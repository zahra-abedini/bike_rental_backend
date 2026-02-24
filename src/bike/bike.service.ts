import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from './bike.entity';
import { CreateBikeDto } from './create-bike.dto';
import { Rental } from '../rental/rental.entity';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepo: Repository<Bike>,

    @InjectRepository(Rental)
    private rentalRepo: Repository<Rental>,
  ) {}

  findAll(): Promise<Bike[]> {
    return this.bikeRepo.find();
  }

  createBike(dto: CreateBikeDto): Promise<Bike> {
    return this.bikeRepo.save({
      name: dto.name, // مقدار جدید را اینجا مپ میکنیم
      status: 'available',
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
  }

  async findOne(id: number) {
    const bike = await this.bikeRepo.findOneBy({ id });
    if (!bike) {
      throw new NotFoundException(`دوچرخه‌ای با آی‌دی ${id} پیدا نشد.`);
    }

    const activeRental: Rental | null = await this.rentalRepo.findOne({
      where: {
        bike_id: id, // استفاده از as any در اینجا برای دور زدن محدودیت چک کردن عمقی تایپ‌اورم
        status: 'ongoing',
      },
    });

    return {
      ...bike,
      rentalStartTime: activeRental?.start_time ?? null,
    };
  }
}
