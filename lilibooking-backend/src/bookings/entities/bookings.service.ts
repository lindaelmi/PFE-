import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Hotel } from 'src/entities/hotel.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async findByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['hotel'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, dto: CreateBookingDto): Promise<Booking> {
    // 1. Vérifier que l'hôtel existe
    const hotel = await this.hotelRepository.findOne({ where: { id: dto.hotelId } });
    if (!hotel) {
      throw new NotFoundException(`Hôtel #${dto.hotelId} non trouvé`);
    }

    // 2. Calculer le nombre de nuits
    const checkInDate = new Date(dto.checkIn);
    const checkOutDate = new Date(dto.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
    if (nights <= 0) {
      throw new Error('La date de départ doit être après la date d’arrivée');
    }

    // 3. Calculer le prix total
    const totalPrice = hotel.pricePerNight * nights * dto.rooms;
    const guests = dto.adults + dto.children;

    // 4. Créer l'entité
    const booking = this.bookingRepository.create({
      user: { id: userId },
      hotel: { id: dto.hotelId },
      hotelName: hotel.name,
      roomType: 'Standard', // À adapter si vous gérez différents types de chambres
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      nights,
      pricePerNight: hotel.pricePerNight,
      totalPrice,
      guests,
      // Ajoutez ces champs si vous les avez dans l'entité :
      // rooms: dto.rooms,
      // paymentMethod: dto.paymentMethod,
    });

    return this.bookingRepository.save(booking);
  }
}