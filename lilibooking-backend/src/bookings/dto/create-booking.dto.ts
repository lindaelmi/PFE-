// src/bookings/dto/create-booking.dto.ts
import { IsInt, IsDateString, IsIn, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  hotelId: number;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsInt()
  @Min(1)
  adults: number;

  @IsInt()
  @Min(0)
  children: number;

  @IsInt()
  @Min(1)
  rooms: number;

  @IsIn(['card', 'onsite'])
  paymentMethod: string;
}