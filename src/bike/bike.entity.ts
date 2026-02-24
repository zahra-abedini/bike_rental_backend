import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bikes')
export class Bike {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() // اضافه کردن ستون نام
  name!: string;

  @Column({ default: 'available' })
  status!: string;

  @Column('double precision')
  latitude!: number;

  @Column('double precision')
  longitude!: number;
}
