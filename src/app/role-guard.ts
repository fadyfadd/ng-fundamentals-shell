import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication-service';
import { inject } from '@angular/core';
import { UserRole } from './enums/user-role';
import { NotificationService } from './notification-service';



export const roleGuard: CanActivateFn = (route, state) => {

  const authentication = inject(AuthenticationService);
  const notifications = inject(NotificationService);
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
