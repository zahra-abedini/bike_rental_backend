import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Payment } from 'src/payment/payment.entity';
import { Rental } from 'src/rental/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rental, Payment])],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
