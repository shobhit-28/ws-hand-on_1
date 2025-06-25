import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { AppInitialiserService } from './services/appInitialiser/app-initialiser.service';

const appInitializerFunction = (initService: AppInitialiserService): () => Promise<void> => () => initService.initFunc();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatSnackBarModule),
    { provide: APP_INITIALIZER, useFactory: appInitializerFunction, multi: true, deps: [AppInitialiserService] }
  ]
};
