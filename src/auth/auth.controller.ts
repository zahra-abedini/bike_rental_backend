import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

// ... سایر ایمپورت‌ها

export class LoginDto {
  @ApiProperty({ example: 'zahra@test.com' })
  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نیست' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'ورود به حساب کاربری' })
  @ApiResponse({
    status: 200,
    description: 'ورود موفقیت‌آمیز',
    schema: {
      example: {
        access_token: 'string',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'ایمیل یا رمز عبور اشتباه است' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
