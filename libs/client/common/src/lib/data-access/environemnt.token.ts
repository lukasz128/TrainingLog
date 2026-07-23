import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  backendMock: boolean;
}

export const ENVIRONMENT_CONFIG = new InjectionToken<Environment>(
  'Environment config',
);
