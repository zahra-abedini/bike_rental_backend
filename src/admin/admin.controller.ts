import { Controller, Post, Get, Body, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { Param } from '@nestjs/common';
import { AdminUserProfileDto } from './admin-user-profile.dto';

class AdminResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin@test.com' })
  email: string;

  @ApiProperty({ example: '2026-02-02T10:00:00.000Z' })
  createdAt: string;
}

class CreateAdminDto {
  @ApiProperty({ example: 'admin@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'ایجاد ادمین جدید' })
  @ApiResponse({
    status: 201,
    description: 'ادمین با موفقیت ساخته شد.',
    type: AdminResponseDto,
  })
  create(@Body() body: CreateAdminDto) {
    return this.adminService.create(body.email, body.password);
  }

  @Get()
  @ApiOperation({ summary: 'دریافت لیست تمام ادمین‌ها' })
  @ApiResponse({
    status: 200,
    description: 'لیست ادمین‌ها برگردانده شد.',
    schema: {
      example: [
        {
          id: 1,
          email: 'admin1@test.com',
          createdAt: '2026-02-02T10:00:00.000Z',
        },
        {
          id: 2,
          email: 'admin2@test.com',
          createdAt: '2026-02-02T11:00:00.000Z',
        },
      ],
    },
  })
  @Roles(Role.ADMIN)
  getAll() {
    return this.adminService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('users')
  @ApiOperation({
    summary: 'دریافت لیست تمامی کاربران سیستم',
    description:
      'مشاهده لیست کلی کاربران بدون جزئیات عمیق (تاریخچه رنت و پرداخت).',
  })
  @ApiResponse({
    status: 200,
    description: 'لیست کاربران با موفقیت دریافت شد.',
    type: [AdminUserProfileDto], // یا یک DTO ساده‌تر اگر لیست سبک‌تر است
  })
  @ApiResponse({ status: 403, description: 'دسترسی غیرمجاز (فقط ادمین).' })
  async getAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Roles(Role.ADMIN)
  @Get('users/:id')
  @ApiOperation({
    summary: 'مشاهده پروفایل کامل و دقیق یک کاربر',
    description: 'شامل اطلاعات فردی، تمام تاریخچه اجاره‌ها و لیست پرداخت‌ها.',
  })
  @ApiParam({ name: 'id', description: 'شناسه منحصر به فرد کاربر', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'اطلاعات کامل کاربر بازیابی شد.',
    type: AdminUserProfileDto,
  })
  @ApiResponse({ status: 404, description: 'کاربری با این شناسه یافت نشد.' })
  async getUserProfile(@Param('id') id: number): Promise<AdminUserProfileDto> {
    return this.adminService.getUserProfile(id);
  }

  @Roles(Role.ADMIN)
  @Put('users/:id')
  @ApiOperation({
    summary: 'ویرایش اطلاعات کاربر توسط مدیر',
    description: 'ادمین می‌تواند نام، ایمیل یا وضعیت کاربر را اصلاح کند.',
  })
  @ApiParam({ name: 'id', description: 'شناسه کاربر جهت ویرایش' })
  @ApiBody({ type: AdminUserProfileDto, description: 'داده‌های جدید کاربر' })
  @ApiResponse({
    status: 200,
    description: 'اطلاعات کاربر با موفقیت بروزرسانی شد.',
    type: AdminUserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'داده‌های ارسالی نامعتبر است.' })
  async updateUser(
    @Param('id') id: number,
    @Body() body: Partial<AdminUserProfileDto>,
  ): Promise<AdminUserProfileDto> {
    return this.adminService.updateUserProfile(id, body);
  }
}
