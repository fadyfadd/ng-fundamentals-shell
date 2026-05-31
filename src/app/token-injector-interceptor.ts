import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from './authentication'

export const tokenInjectorInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(Authentication);
  const token = authService.getJwtToken()?.token;

   if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }
   return next(req);
};

 
