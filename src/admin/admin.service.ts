import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';
import { User } from '../user/user.entity';
import { Rental } from '../rental/rental.entity';
import { Payment } from '../payment/payment.entity';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminUserProfileDto } from './admin-user-profile.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Rental)
    private rentalRepo: Repository<Rental>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async create(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.adminRepo.save({ email, password: hashed });
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminRepo.findOneBy({ email });
    if (!admin) return null;

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return null;

    return admin;
  }

  async findAll() {
    return this.adminRepo.find();
  }

  async findAllUsers() {
    return this.userRepo.find();
  }

  // پروفایل کاربر به همراه رنت و پرداخت‌ها
  async getUserProfile(userId: number): Promise<AdminUserProfileDto> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const rentals = await this.rentalRepo.find({ where: { user_id: userId } });

    let payments: Payment[] = [];
    if (rentals.length > 0) {
      payments = await this.paymentRepo.find({
        where: { rental_id: In(rentals.map((r) => r.id)) },
      });
    }

    // تبدیل داده‌های دیتابیس به فرمت DTO
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image, // مپ کردن فیلد دیتابیس به DTO
      rentals: rentals.map((r) => ({
        id: r.id,
        bike_id: r.bike_id,
        start_time: r.start_time,
        end_time: r.end_time,
        cost: r.cost,
        status: r.status,
      })),
      payments: payments.map((p) => ({
        id: p.id,
        rental_id: p.rental_id,
        amount: p.amount,
        status: p.status,
      })),
    };
  }

  // ویرایش کاربر
  async updateUserProfile(userId: number, data: Partial<User>) {
    if (data.password) {
      const bcrypt = await import('bcryptjs');
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepo.update(userId, data);
    return this.getUserProfile(userId);
  }
}
