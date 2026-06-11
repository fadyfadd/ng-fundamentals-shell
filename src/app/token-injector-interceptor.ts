import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './authentication'
import { delay, finalize } from 'rxjs';
import { SpinnerService } from './spinner/spinner-service';

export const tokenInjectorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authentication);
  const spinnerService = inject(SpinnerService);
  const token = authService.getJwtToken()?.token;

   const finalReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) 
    : req;

   spinnerService.show();
  
  return next(finalReq).pipe(delay(1000),
    finalize(() => spinnerService.hide())
  );
};






