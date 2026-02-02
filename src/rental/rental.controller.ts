import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartRentalDto {
  @ApiProperty({ example: 1, description: 'شناسه کاربر' })
  @IsNumber({}, { message: 'شناسه کاربر باید عدد باشد' }) // حتما اضافه شود
  userId: number;

  @ApiProperty({ example: 10, description: 'شناسه دوچرخه' })
  @IsNumber({}, { message: 'شناسه دوچرخه باید عدد باشد' }) // حتما اضافه شود
  bikeId: number;
}

@Controller('rentals')
export class RentalController {
  constructor(private rentalService: RentalService) {}

  @UseGuards(JwtGuard)
  @Roles(Role.USER)
  @Post('start')
  start(@Body() body: StartRentalDto) {
    return this.rentalService.startRental(body.userId, body.bikeId);
  }

  @UseGuards(JwtGuard)
  @Roles(Role.USER)
  @Post('end/:rentalId')
  end(@Param('rentalId') rentalId: number) {
    return this.rentalService.endRental(rentalId);
  }
}
