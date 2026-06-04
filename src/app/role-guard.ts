import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from './authentication';
import { inject } from '@angular/core';
import { UserRole } from './enums/user-role';
import { Notification } from './notification';



export const roleGuard: CanActivateFn = (route, state) => {

  const authentication = inject(Authentication);
  const notifications = inject(Notification);
  const router = inject(Router);

  if (route.data && route.data['roles']) {
    
    const requiredRoles = route.data['roles'] as UserRole[];
    const userRole = authentication.getJwtToken()?.role;

    const hasRequiredRole = requiredRoles.includes(userRole!);
    if (!hasRequiredRole) {
      notifications.showError("You don't have permission to access this page.");
      return router.navigate(['/login']).then(() => false);       
    }
  }

  return true;

};
