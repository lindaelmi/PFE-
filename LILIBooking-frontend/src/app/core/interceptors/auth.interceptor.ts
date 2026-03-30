import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🚀 Interceptor appelé pour:', req.url); // <- AJOUTEZ CECI
  const authService = inject(AuthService);
  const token = authService.getToken();
  console.log('🔍 token:', token);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }
  return next(req);
};