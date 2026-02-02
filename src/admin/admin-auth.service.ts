import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from './admin.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminService.validateAdmin(email, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = {
      adminId: admin.id,
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
