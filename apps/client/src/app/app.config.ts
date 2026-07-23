import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { ENVIRONMENT_CONFIG } from 'common';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { CustomRouteReuseStrategy } from './utils/custom-router-reuse-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideHttpClient(),
    { provide: ENVIRONMENT_CONFIG, useValue: environment },
  ],
};
