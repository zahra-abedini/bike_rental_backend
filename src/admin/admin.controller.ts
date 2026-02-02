import { Controller, Post, Get, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/auth/public.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateAdminDto {
  @ApiProperty({ example: 'admin@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Post('create')
  create(@Body() body: CreateAdminDto) {
    return this.adminService.create(body.email, body.password);
  }

  @Get()
  getAll() {
    return this.adminService.findAll();
  }
}
