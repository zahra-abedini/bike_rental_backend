import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { IsNumber } from 'class-validator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';

export class StartRentalDto {
  @ApiProperty({ example: 1, description: 'شناسه کاربر' })
  @IsNumber({}, { message: 'شناسه کاربر باید عدد باشد' })
  userId: number;

  @ApiProperty({ example: 10, description: 'شناسه دوچرخه' })
  @IsNumber({}, { message: 'شناسه دوچرخه باید عدد باشد' })
  bikeId: number;
}

@ApiTags('Rentals')
@ApiBearerAuth() // تمام متدهای این کنترلر نیاز به توکن دارند
@Controller('rentals')
export class RentalController {
  constructor(private rentalService: RentalService) {}

  @UseGuards(JwtGuard)
  @Roles(Role.USER)
  @Post('start')
  @ApiOperation({
    summary: 'شروع اجاره دوچرخه',
    description:
      'یک رکورد اجاره جدید ایجاد کرده و وضعیت دوچرخه را به "رزرو شده" تغییر می‌دهد.',
  })
  @ApiResponse({
    status: 201,
    description: 'اجاره با موفقیت شروع شد.',
    schema: {
      example: {
        id: 1,
        userId: 1,
        bikeId: 10,
        startTime: '2026-02-02T10:00:00Z',
        status: 'ONGOING',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'دوچرخه در حال حاضر در دسترس نیست یا کاربر بدهی قبلی دارد.',
  })
  @ApiResponse({ status: 401, description: 'عدم احراز هویت (توکن نامعتبر).' })
  start(@Body() body: StartRentalDto) {
    return this.rentalService.startRental(body.userId, body.bikeId);
  }

  @UseGuards(JwtGuard)
  @Roles(Role.USER)
  @Post('end/:rentalId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'پایان اجاره و محاسبه هزینه',
    description:
      'زمان پایان را ثبت کرده، هزینه را محاسبه می‌کند و دوچرخه را آزاد می‌کند.',
  })
  @ApiParam({
    name: 'rentalId',
    description: 'شناسه رکورد اجاره جاری',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'اجاره با موفقیت به پایان رسید.',
    schema: {
      example: {
        id: 1,
        durationMinutes: 45,
        totalCost: 15000,
        status: 'FINISHED',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'رکورد اجاره با این شناسه یافت نشد.',
  })
  @ApiResponse({
    status: 403,
    description: 'این اجاره متعلق به کاربر فعلی نیست.',
  })
  end(@Param('rentalId') rentalId: number) {
    return this.rentalService.endRental(Number(rentalId));
  }
}
