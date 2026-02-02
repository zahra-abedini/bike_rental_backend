import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bikes')
export class Bike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'available' })
  status: string; // available | rented

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;
}
