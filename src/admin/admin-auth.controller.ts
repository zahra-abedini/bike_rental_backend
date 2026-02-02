import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: { id: 1, email: 'admin@test.com' } })
  user: any;
}

class LoginAdminDto {
  @ApiProperty({ example: 'admin@test.com', description: 'ایمیل ادمین' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'رمز عبور' })
  @IsString()
  @MinLength(6)
  password: string;
}

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'ورود ادمین',
    description: 'دریافت توکن JWT با استفاده از ایمیل و رمز عبور',
  })
  @ApiResponse({
    status: 200,
    description: 'ورود موفقیت‌آمیز. توکن با موفقیت صادر شد.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'ایمیل یا رمز عبور اشتباه است.',
  })
  @ApiResponse({
    status: 400,
    description: 'داده‌های ورودی نامعتبر هستند.',
  })
  login(@Body() body: LoginAdminDto) {
    return this.adminAuthService.login(body.email, body.password);
  }
}
