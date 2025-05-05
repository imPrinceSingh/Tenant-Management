import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  features = signal<Array<any>>([
    {
      id: 'chat-support',
      name: 'Chat Support',
      enabled: false,
      description: 'Enable real-time customer chat support',
      icon: 'chat',
      route: 'chat-support'
    },
    {
      id: 'billing',
      name: 'Billing System',
      enabled: false,
      description: 'Enable payment processing and invoicing',
      icon: 'credit_card',
      route: 'billing'
    },
    {
      id: 'setting',
      name: 'Settings',
      enabled: true,
      description: 'Enable extra setting feature',
      icon: 'settings',
      route: 'settings'
    }
  ]);

  userRoles = [
    {
      id: 'Admin',
      name: 'Admin'
    },
    {
      id: 'Manager',
      name: 'Manager'
    },
    {
      id: 'Contributor',
      name: 'Contributor'
    }
  ]

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  constructor() { }
}
