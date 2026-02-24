import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rental_id!: number;

  @Column()
  amount!: number;

  @Column()
  status!: string;
}
