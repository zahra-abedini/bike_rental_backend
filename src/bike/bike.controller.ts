/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { BikeService } from './bike.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { Bike } from './bike.entity';
import { CreateBikeDto } from './create-bike.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Bikes')
@Controller('bikes')
export class BikeController {
  constructor(private bikeService: BikeService) {}

  @ApiOperation({ summary: 'لیست تمام دوچرخه‌ها' })
  @ApiResponse({ status: 200, description: 'موفق', type: [Bike] })
  @Get()
  getAll(): Promise<Bike[]> {
    return this.bikeService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ایجاد دوچرخه جدید (Admin فقط)' })
  @ApiResponse({ status: 201, description: 'دوچرخه ساخته شد', type: Bike })
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: CreateBikeDto): Promise<Bike> {
    return this.bikeService.createBike(body);
  }
}
