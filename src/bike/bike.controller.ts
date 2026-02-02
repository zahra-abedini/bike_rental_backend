import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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

  @Get()
  @ApiOperation({
    summary: 'مشاهده لیست تمام دوچرخه‌ها',
    description:
      'این متد لیست تمامی دوچرخه‌های موجود در سیستم را به همراه جزئیات برمی‌گرداند.',
  })
  @ApiResponse({
    status: 200,
    description: 'لیست دوچرخه‌ها با موفقیت دریافت شد.',
    type: [Bike],
  })
  getAll(): Promise<Bike[]> {
    return this.bikeService.findAll();
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'ثبت دوچرخه جدید (فقط مدیر سیستم)',
    description:
      'این متد مخصوص ادمین است و برای اضافه کردن دوچرخه به ناوگان استفاده می‌شود.',
  })
  @ApiResponse({
    status: 201,
    description: 'دوچرخه جدید با موفقیت در دیتابیس ثبت شد.',
    type: Bike,
  })
  @ApiResponse({
    status: 401,
    description: 'توکن نامعتبر است یا ارسال نشده است.',
  })
  @ApiResponse({
    status: 403,
    description: 'دسترسی غیرمجاز! فقط ادمین اجازه دسترسی به این بخش را دارد.',
  })
  @ApiResponse({
    status: 400,
    description: 'خطا در اعتبارسنجی داده‌های ورودی.',
  })
  create(@Body() body: CreateBikeDto): Promise<Bike> {
    return this.bikeService.createBike(body);
  }
}
