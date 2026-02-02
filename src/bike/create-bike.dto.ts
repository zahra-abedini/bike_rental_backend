import { ApiProperty } from '@nestjs/swagger';

export class CreateBikeDto {
  @ApiProperty({ description: 'عرض جغرافیایی دوچرخه', example: 52.3702 })
  latitude: number;
  @ApiProperty({ description: 'طول جغرافیایی دوچرخه', example: 4.8952 })
  longitude: number;
}
