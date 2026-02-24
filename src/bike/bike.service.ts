import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike } from './bike.entity';
import { CreateBikeDto } from './create-bike.dto';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike)
    private bikeRepo: Repository<Bike>,
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

  async findOne(id: number): Promise<Bike> {
    const bike = await this.bikeRepo.findOneBy({ id });
    if (!bike) {
      throw new NotFoundException(`دوچرخه‌ای با آی‌دی ${id} پیدا نشد.`);
    }
    return bike;
  }
}
