import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ma-cle-secrete-123', // ⚠️ identique à celui du module
    });
  }

  async validate(payload: any) {
    console.log('✅ JwtStrategy.validate() - payload reçu:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}