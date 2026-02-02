import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
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
}
