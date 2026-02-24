import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateBikeDto {
  @ApiProperty({ description: 'نام دوچرخه', example: 'دوچرخه کوهستان مدل A1' })
  @IsString({ message: 'نام باید متن باشد' })
  @IsNotEmpty({ message: 'نام نمی‌تواند خالی باشد' })
  name!: string;

  @ApiProperty({ description: 'عرض جغرافیایی', example: 36.3178 })
  @IsNumber({}, { message: 'عرض جغرافیایی باید عدد باشد' })
  latitude!: number;

  @ApiProperty({ description: 'طول جغرافیایی', example: 50.0387 })
  @IsNumber({}, { message: 'طول جغرافیایی باید عدد باشد' })
  longitude!: number;
}
