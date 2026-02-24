import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  bike_id!: number;

  @Column()
  start_time!: Date;

  @Column({ nullable: true })
  end_time!: Date;

  @Column({ nullable: true })
  cost!: number;

  @Column({ default: 'ongoing' })
  status!: string;
}
