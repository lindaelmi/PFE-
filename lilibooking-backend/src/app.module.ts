import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HotelsModule } from './hotels/hotels.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/entities/bookings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { Hotel } from './entities/hotel.entity';
import { Booking } from './entities/booking.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'lilibooking.db',
      entities: [User, ContactMessage, Hotel, Booking],
      synchronize: true,
  
      logging: true,
    }),
    HotelsModule,
    AuthModule,
    ContactModule,
    StatsModule,
    UsersModule,
    BookingsModule, // ← ajout
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}