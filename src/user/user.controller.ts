import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Zahra' })
  name: string;

  @ApiProperty({ example: 'zahra@test.com' })
  email: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'Zahra', description: 'نام کامل کاربر' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'zahra@test.com', description: 'ایمیل منحصر به فرد' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'رمز عبور (حداقل ۶ کاراکتر)' })
  @IsString()
  @MinLength(6)
  password: string;
}

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  @ApiOperation({
    summary: 'ثبت‌نام کاربر جدید',
    description: 'ایجاد یک حساب کاربری جدید در سیستم',
  })
  @ApiResponse({
    status: 201,
    description: 'کاربر با موفقیت ساخته شد',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'خطای اعتبارسنجی داده‌ها',
  })
  @ApiResponse({
    status: 409,
    description: 'این ایمیل قبلاً در سیستم ثبت شده است',
  })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body.name, body.email, body.password);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    summary: 'دریافت لیست تمامی کاربران',
    description: 'این متد فقط برای مدیران یا کاربران احراز هویت شده است',
  })
  @ApiResponse({
    status: 200,
    description: 'لیست کاربران با موفقیت بازیابی شد',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'توکن یافت نشد یا منقضی شده است' })
  getAll() {
    return this.userService.findAll();
  }
}
