import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Hotel } from '../entities/hotel.entity';
import { Booking } from '../entities/booking.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// ✅ On utilise 'stats' car le préfixe global '/api' est déjà défini dans main.ts
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StatsController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Hotel)
    private hotelRepo: Repository<Hotel>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  @Get()
  async getStats(@Request() req) {
    console.log('✅ StatsController - req.user:', req.user);

    const usersCount = await this.userRepo.count();
    const hotelsCount = await this.hotelRepo.count();
    const bookingsCount = await this.bookingRepo.count();
    const revenueResult = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('SUM(booking.totalPrice)', 'total')
      .getRawOne();
    const revenue = revenueResult?.total || 0;

    return {
      users: usersCount,
      hotels: hotelsCount,
      bookings: bookingsCount,
      revenue,
    };
  }
}