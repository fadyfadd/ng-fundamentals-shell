import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfigService } from './config-service';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { tokenInjectorInterceptor } from './token-injector-interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatSnackBarModule),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideHttpClient(withInterceptors([tokenInjectorInterceptor])
    ),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.loadConfig()
    })
  ]
};
