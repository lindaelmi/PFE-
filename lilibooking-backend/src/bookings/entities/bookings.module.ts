import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from 'src/entities/booking.entity';
import { Hotel } from 'src/entities/hotel.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Booking, Hotel])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}