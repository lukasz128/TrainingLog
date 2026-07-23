import { inject, Type } from '@angular/core';
import { ENVIRONMENT_CONFIG } from '../data-access/environemnt.token';

export type ProvideHttpServiceConfig<TService, TMockService> = {
  service: Type<TService>;
  mockService: Type<TMockService>;
};

export const getHttpService = <TService, TMockService>({
  service,
  mockService,
}: ProvideHttpServiceConfig<TService, TMockService>) => {
  return () => {
    const env = inject(ENVIRONMENT_CONFIG);

    return env.backendMock ? new mockService() : new service();
  };
};
