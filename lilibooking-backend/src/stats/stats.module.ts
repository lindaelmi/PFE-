import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { User } from '../entities/user.entity';
import { Hotel } from '../entities/hotel.entity';
import { Booking } from '../entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Hotel, Booking])],
  controllers: [StatsController],
})
export class StatsModule {}