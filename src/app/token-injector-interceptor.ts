import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication-service'
import { delay, finalize } from 'rxjs';
import { SpinnerService } from './spinner-component/spinner-service';

export const tokenInjectorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const spinnerService = inject(SpinnerService);
  const token = authService.getJwtToken()?.token;

  const finalReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  spinnerService.show();

  return next(finalReq).pipe(delay(100),
    finalize(() => spinnerService.hide())
  );
};






