import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Wrong password');
    }

    // این همان اطلاعاتی است که به JwtStrategy می‌رود
    const payload = {
      sub: user.id,
      userId: user.id,
      role: 'user', // یا user.role اگر در دیتابیس دارید
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
