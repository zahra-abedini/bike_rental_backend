import { ApiProperty } from '@nestjs/swagger';

export class CreateBikeDto {
  @ApiProperty({ description: 'نام دوچرخه', example: 'دوچرخه کوهستان مدل A1' })
  name!: string;

  @ApiProperty({ description: 'عرض جغرافیایی', example: 52.3702 })
  latitude!: number;

  @ApiProperty({ description: 'طول جغرافیایی', example: 4.8952 })
  longitude!: number;
}
