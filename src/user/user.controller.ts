import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Zahra' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'zahra@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'ایجاد کاربر جدید' })
  @ApiResponse({
    status: 201,
    description: 'کاربر با موفقیت ساخته شد',
    schema: { example: { id: 1, name: 'Zahra', email: 'zahra@test.com' } },
  })
  @ApiResponse({
    status: 400,
    description: 'داده‌های ارسالی اشتباه است (Validation Error)',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'ایمیل قبلاً ثبت شده است',
    schema: {
      example: { statusCode: 409, message: 'Conflict: Email already exists' },
    },
  })
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body.name, body.email, body.password);
  }

  @Get()
  getAll() {
    return this.userService.findAll();
  }
}
