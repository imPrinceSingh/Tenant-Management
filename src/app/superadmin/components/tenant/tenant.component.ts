import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

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
  imports: [NgClass, MatIconModule, RouterLink, MatDialogModule],
  templateUrl: './tenant.component.html',
})
export class TenantComponent implements OnInit {
  tenantService = inject(TenantService)
  tenants = this.tenantService.tenantList

  onEdit(tenant: any) {
    this.router.navigate(['/tenant-registration'], {
      state: { tenantId: tenant.id }
    });
  }
  onDelete(tenant: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.patch(`http://localhost:3000/tenants/${tenant.id}`, { enabled: false }).subscribe({
          next: (response) => {
            const updatedTenants = this.tenants().filter(item => item.id !== tenant.id)
            this.tenants.set(updatedTenants)
          this.toastr.success('Tenant removed successfully', 'Success')
            console.log('Delete successful', response)
          },
          error: (err) => {
          this.toastr.error('Error while deleting tenant', 'Error')
            console.error('Delete failed', err)
          }
        })
      }
    });
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

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog , private toastr : ToastrService) { }

}
