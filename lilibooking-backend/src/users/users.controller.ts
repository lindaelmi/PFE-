import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')   // ✅ Correction : on retire /api (le préfixe global est déjà défini)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Get()
  @Roles('admin')
  async findAll() {
    return this.userRepo.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive'],
    });
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: number) {
    await this.userRepo.delete(id);
    return { deleted: true };
  }
}