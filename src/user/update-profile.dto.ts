import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Zahra' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'zahra@test.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'https://cdn.site/avatar.png' })
  @IsOptional()
  @IsString()
  profile_image?: string;
}
