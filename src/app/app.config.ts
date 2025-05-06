import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideTranslate } from '../app/providers/translate.provider'; 

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(),
     provideTranslate(),
      provideAnimations(),
      provideToastr({
        timeOut: 5000,
        positionClass: 'toast-custom-position',
        preventDuplicates: true,
        countDuplicates: true,
        resetTimeoutOnDuplicate: true,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning',
        },
        newestOnTop: false,
        progressBar: true,
        progressAnimation: 'decreasing',
        toastClass: 'ngx-toastr shadow-lg',
        titleClass: 'font-medium',
        messageClass: 'text-sm'
      })
    ]
};
