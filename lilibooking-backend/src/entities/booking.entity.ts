import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Hotel } from './hotel.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // Relation ManyToOne vers User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation ManyToOne vers Hotel
  @ManyToOne(() => Hotel)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  // Champs dénormalisés (pour affichage)
  @Column()
  hotelName: string;

  @Column()
  roomType: string;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column()
  nights: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  guests: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}