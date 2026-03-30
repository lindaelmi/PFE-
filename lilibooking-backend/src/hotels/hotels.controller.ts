import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';

@Controller('hotels')
export class HotelsController {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
  ) {}

  // ✅ GET /api/hotels – liste tous les hôtels
  @Get()
  async findAll(): Promise<Hotel[]> {
    return this.hotelsRepository.find();
  }

  // ✅ GET /api/hotels/search – recherche par destination
  @Get('search')
  async search(@Query('destination') destination?: string): Promise<Hotel[]> {
    if (!destination || destination.trim() === '') {
      return this.hotelsRepository.find();
    }
    return this.hotelsRepository.find({
      where: [
        { city: Like(`%${destination}%`) },
        { country: Like(`%${destination}%`) }
      ]
    });
  }

  // ✅ GET /api/hotels/:id – détail d'un hôtel
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Hotel> {
    return this.hotelsRepository.findOne({ where: { id } });
  }

  // ✅ POST /api/hotels – créer un hôtel
  @Post()
  async create(@Body() hotelData: Partial<Hotel>): Promise<Hotel> {
    const hotel = this.hotelsRepository.create(hotelData);
    return this.hotelsRepository.save(hotel);
  }

  // ✅ PUT /api/hotels/:id – mettre à jour
  @Put(':id')
  async update(@Param('id') id: number, @Body() hotelData: Partial<Hotel>): Promise<Hotel> {
    await this.hotelsRepository.update(id, hotelData);
    return this.hotelsRepository.findOne({ where: { id } });
  }

  // ✅ DELETE /api/hotels/:id – supprimer
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.hotelsRepository.delete(id);
  }
}