import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { App } from './app/app';
import { appConfig } from './app/app.config';

defineCustomElements(window);
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
