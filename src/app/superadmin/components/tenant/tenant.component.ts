import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  status: boolean;
  theme: {
    logoUrl : string;
    primaryColor : string;
    mode: string;
  };
}

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [NgFor,NgClass,MatIconModule],
  templateUrl: './tenant.component.html',
})
export class TenantComponent {
  @Input() tenants: Tenant[] = [
    {
      "id": "org001",
      "name": "Acme Corp",
      "email": "ddd",
      "status": true,
      "theme": {
        "logoUrl": "/assets/logos/acme.png",
        "primaryColor": "#1976d2",
        "mode": "dark"
      },
    },
    {
      "id": "org002",
      "name": "Globex Ltd",
      "email": "ddd",
      "status": false,
      "theme": {
        "logoUrl": "/assets/logos/globex.png",
        "primaryColor": "#c62828",
        "mode": "light"
      }
    }
  ];

  @Output() view = new EventEmitter<Tenant>();
  @Output() edit = new EventEmitter<Tenant>();
  @Output() delete = new EventEmitter<Tenant>();

  onView(tenant: Tenant) {
    this.view.emit(tenant);
  }

  onEdit(tenant: Tenant) {
    this.edit.emit(tenant);
  }

  onDelete(tenant: Tenant) {
    this.delete.emit(tenant);
  }
}
