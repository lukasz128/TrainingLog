import { InjectionToken } from '@angular/core';

export type Icon = {
  readonly name: string;
  readonly path: string;
};

export type IconStore = Record<string, { path: string }>;
export type AvailableIcon = keyof typeof iconsStore;

const BASE_PATH_URL = '/assets/icons/';
const iconsStore = {
  dashboard: {
    path: BASE_PATH_URL + 'dashboard.svg',
  },
  menu: {
    path: BASE_PATH_URL + 'menu.svg',
  },
  training: {
    path: BASE_PATH_URL + 'training.svg',
  },
  info: {
    path: BASE_PATH_URL + 'info.svg',
  },
  info2: {
    path: BASE_PATH_URL + 'info2.svg',
  },
  date: {
    path: BASE_PATH_URL + 'date.svg',
  },
  time: {
    path: BASE_PATH_URL + 'time.svg',
  },
  lightning: {
    path: BASE_PATH_URL + 'lightning.svg',
  },
} satisfies IconStore;

export const ICON_STORE = new InjectionToken<IconStore>('ICON STORE', {
  providedIn: 'root',
  factory: () => iconsStore,
});
