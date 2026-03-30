import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()


export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

 canActivate(context: ExecutionContext): boolean {
  const { user } = context.switchToHttp().getRequest();
  console.log('🔍 RolesGuard - user dans la requête:', user);
  const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
    context.getHandler(),
    context.getClass(),
  ]);
  console.log('🔍 RolesGuard - rôles requis:', requiredRoles);
  if (!requiredRoles) return true;
  return requiredRoles.some((role) => user?.role === role);
}
}