import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminAuthService } from './admin-auth.service';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      secret: 'ADMIN_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AdminService, AdminAuthService],
  controllers: [AdminController, AdminAuthController],
})
export class AdminModule {}
