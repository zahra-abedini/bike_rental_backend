import { Controller, Post, Get, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

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
}
