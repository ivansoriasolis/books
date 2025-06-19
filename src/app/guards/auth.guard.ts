import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.authState$.pipe( // Obtener el estado de autenticación del servicio
    take(1), // Tomar solo el primer valor emitido
    map(user => user ? true : router.createUrlTree(['/login'])) // Si el usuario está autenticado, permitir el acceso; de lo contrario, redirigir al login
  );
};

