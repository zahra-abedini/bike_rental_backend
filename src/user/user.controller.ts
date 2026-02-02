import { Controller, Post, Get, Body, Put } from '@nestjs/common';
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
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { JwtUser } from 'src/auth/current-user.decorator';
import { UpdateProfileDto } from './update-profile.dto';

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

class UserRentalResponseDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: '2026-02-02T10:00:00Z' }) startTime: string;
  @ApiProperty({ example: 'finished' }) status: string;
  @ApiProperty({ example: { brand: 'Giant', model: 'Escape 3' } }) bike: any;
}

@ApiTags('Users')
@ApiBearerAuth()
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

  // 👤 پروفایل
  @Get('profile')
  @ApiOperation({
    summary: 'دریافت اطلاعات پروفایل شخصی',
    description: 'اطلاعات پایه کاربر جاری را برمی‌گرداند.',
  })
  @ApiResponse({
    status: 200,
    description: 'اطلاعات پروفایل دریافت شد.',
    schema: {
      example: {
        id: 1,
        name: 'Zahra',
        email: 'zahra@test.com',
        profilePicture: 'url',
      },
    },
  })
  getMe(@CurrentUser() user: JwtUser) {
    return this.userService.getProfile(user.userId);
  }

  // 🚴 تاریخچه رنت‌ها
  @Get('rentals')
  @ApiOperation({ summary: 'مشاهده تاریخچه اجاره‌های من' })
  @ApiResponse({
    status: 200,
    description: 'لیست رنت‌ها به همراه اطلاعات دوچرخه‌ها',
    type: [UserRentalResponseDto],
  })
  getMyRentals(@CurrentUser() user: JwtUser) {
    return this.userService.getRentals(user.userId);
  }

  // 💳 پرداخت‌ها
  @Get('payments')
  @ApiOperation({ summary: 'مشاهده تاریخچه تراکنش‌های مالی من' })
  @ApiResponse({
    status: 200,
    description: 'لیست تمامی پرداخت‌ها',
    schema: {
      example: [
        { id: 10, amount: 50000, status: 'success', date: '2026-02-01' },
      ],
    },
  })
  getMyPayments(@CurrentUser() user: JwtUser) {
    return this.userService.getPayments(user.userId);
  }

  // ✏️ ویرایش پروفایل
  @Put('profile')
  @ApiOperation({ summary: 'آپدیت اطلاعات کاربری' })
  @ApiResponse({ status: 200, description: 'پروفایل با موفقیت بروزرسانی شد' })
  @ApiResponse({ status: 400, description: 'داده‌های ارسالی معتبر نیستند' })
  updateProfile(@CurrentUser() user: JwtUser, @Body() body: UpdateProfileDto) {
    return this.userService.updateProfile(user.userId, body);
  }
}
