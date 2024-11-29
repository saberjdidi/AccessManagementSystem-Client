import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data['roles'] as string[];
  const matSnackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRoles = authService.getRoles();

  if(!authService.isLoggedIn()){
     router.navigate(['/login']);
     matSnackBar.open('You must log in to view this page.', 'Ok', { duration: 3000 });
    return false;
  }

  if(roles.some((role) => userRoles?.includes(role))) return true;
  
  router.navigate(['/']);
  matSnackBar.open('You do not have permission to view this page.', 'Ok', { duration: 3000 });

     return false;
};
