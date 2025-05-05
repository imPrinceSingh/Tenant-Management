import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { HttpClient } from '@angular/common/http';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  industry: string;
  status: boolean;
  enabled: boolean
}

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [NgClass,MatIconModule, RouterLink],
  templateUrl: './tenant.component.html',
})
export class TenantComponent implements OnInit{
  tenantService = inject(TenantService)
  tenants = this.tenantService.tenantList

  onEdit(tenant: any) {
    this.router.navigate(['/tenant-registration'], {
      state: { tenantId: tenant.id }
    });
  }

  onDelete(tenant: any) {
   let updatedTenant = {
    enabled: false
    }
    this.http.patch(`http://localhost:3000/tenants/${tenant.id}`, updatedTenant).subscribe({
      next: (response)=>{
        const updatedTenants = this.tenants().filter(item=> item.id!==tenant.id)
        this.tenants.set(updatedTenants)
        console.log('Update successful', response)
    },
    error: (err)=>{
      console.error('Update failed', err)
    }
   })
  }

  ngOnInit(): void {
    this.http.get<Tenant[]>('http://localhost:3000/tenants?enabled=true').subscribe({
      next: (data) => {
        this.tenants.set(data)
      },
      error: (err) => {
        console.error('Failed to fetch tenants:', err);
      }
    });
  }

  constructor(private http: HttpClient, private router: Router) { }

}
