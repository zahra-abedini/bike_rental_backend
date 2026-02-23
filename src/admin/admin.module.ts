import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminAuthService } from './admin-auth.service';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';
import { User } from '../user/user.entity';
import { Rental } from '../rental/rental.entity';
import { Payment } from '../payment/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, User, Rental, Payment]),
    PassportModule,
    JwtModule.register({
      secret: 'ADMIN_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AdminService, AdminAuthService, AdminJwtStrategy],
  controllers: [AdminController, AdminAuthController],
})
export class AdminModule {}
