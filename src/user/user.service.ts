import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Rental } from '../rental/rental.entity';
import { Payment } from '../payment/payment.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Rental)
    private rentalRepo: Repository<Rental>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  // 🔐 ثبت‌نام
  async create(name: string, email: string, password: string): Promise<User> {
    const hashed: string = await bcrypt.hash(password, 10);

    return this.userRepo.save({
      name,
      email,
      password: hashed,
    });
  }

  // 📋 همه کاربران (Admin)
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  // 🔍 پیدا کردن با ایمیل (برای لاگین)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  // 👤 پروفایل کاربر
  async getProfile(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return null;

    const activeRental = await this.rentalRepo.findOne({
      where: { user_id: userId, status: 'ongoing' },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image,
      created_at: user.created_at,
      activeBikeId: activeRental ? activeRental.bike_id : null,
      activeRental,
    };
  }

  // 🚴 تاریخچه رنت‌ها
  async getRentals(userId: number) {
    return this.rentalRepo.find({
      where: { user_id: userId },
      order: { start_time: 'DESC' },
      relations: ['bike'],
    });
  }

  // 💳 پرداخت‌ها
  async getPayments(userId: number) {
    const rentals = await this.rentalRepo.find({
      where: { user_id: userId },
    });

    const rentalIds = rentals.map((r) => r.id);
    if (rentalIds.length === 0) return [];

    return this.paymentRepo.find({
      where: { rental_id: In(rentalIds) },
    });
  }

  // ✏️ ویرایش پروفایل
  async updateProfile(userId: number, data: Partial<User>) {
    await this.userRepo.update(userId, data);
    return this.userRepo.findOneBy({ id: userId });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }
}
