import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from './bike.entity';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';
import { Rental } from 'src/rental/rental.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Bike, Rental])],
  controllers: [BikeController],
  providers: [BikeService],
})
export class BikeModule {}
