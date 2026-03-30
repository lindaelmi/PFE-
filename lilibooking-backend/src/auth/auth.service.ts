import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ============================================
  // INSCRIPTION
  // ============================================
  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'user',
    });

    await this.usersRepository.save(user);

    // Générer le token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    console.log('✅ AuthService.register - payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ============================================
  // CONNEXION
  // ============================================
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    // Chercher l'utilisateur
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    console.log('✅ AuthService.login - utilisateur trouvé:', user.email, 'rôle:', user.role);

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token
    const payload = { sub: user.id, email: user.email, role: user.role };
    console.log('✅ AuthService.login - payload créé:', payload);
    return { access_token: this.jwtService.sign(payload) };
  }

  // ============================================
  // PROFIL UTILISATEUR
  // ============================================
  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    // Ne pas renvoyer le mot de passe
    const { password, ...result } = user;
    return result;
  }
}