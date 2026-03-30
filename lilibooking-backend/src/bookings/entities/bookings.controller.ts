import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from '../dto/create-booking.dto';


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@Req() req) {
    const userId = req.user.userId ?? req.user.sub;
    return this.bookingsService.findByUserId(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBooking(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    const userId = req.user.userId ?? req.user.sub;
    return this.bookingsService.create(userId, createBookingDto);
  }
}