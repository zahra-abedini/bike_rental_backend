import { ApiProperty } from '@nestjs/swagger';

export class RentalDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  bike_id!: number;

  @ApiProperty({ example: '2026-02-02T10:00:00.000Z' })
  start_time!: Date;

  @ApiProperty({ example: '2026-02-02T12:00:00.000Z' })
  end_time?: Date;

  @ApiProperty({ example: 50 })
  cost?: number;

  @ApiProperty({ example: 'ongoing' })
  status!: string;
}

export class PaymentDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  rental_id!: number;

  @ApiProperty({ example: 50 })
  amount!: number;

  @ApiProperty({ example: 'paid' })
  status!: string;
}

export class AdminUserProfileDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Zahra' })
  name!: string;

  @ApiProperty({ example: 'zahra@test.com' })
  email!: string;

  @ApiProperty({ example: 'https://cdn.site/avatar.png', required: false })
  profile_image?: string;

  @ApiProperty({ type: [RentalDto] })
  rentals!: RentalDto[];

  @ApiProperty({ type: [PaymentDto] })
  payments!: PaymentDto[];
}
