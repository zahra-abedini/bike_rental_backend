import { Injectable } from '@nestjs/common';
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
      status: 'available',
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
  }
}
