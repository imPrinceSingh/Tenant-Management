import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserManagementService } from '../../services/user-management.service';
import { NgFor, NgIf } from '@angular/common';
import { TenantService } from '../../services/tenant.service';
import { AuthService } from '../../../auth/services/auth.service';
import { SidenavService } from '../../../shared/services/sidenav.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [NgIf, ReactiveFormsModule, FormsModule]
})
export class SettingsComponent {
  tenantService = inject(TenantService)
  authService = inject(AuthService)
  sideNavService = inject(SidenavService)
  
  tenantId = this.authService.tenantId
  tenantInfo = this.sideNavService.tenantInfo

  themeColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Custom', value: '' }
  ];
  theme = signal('')
  logoUrl = signal('')
  selectedFile: File | null = null
  isLoading = false;
  successMessage = '';

  updateThemeColor(event: Event) {
    const input = event.target as HTMLInputElement;
    this.theme.set(input.value);
  }

  updateTheme(value: string) {
    // Validate hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      this.theme.set(value);
    }
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.logoUrl.set(base64);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveSettings() {
    let payload: any = {}
    if (this.logoUrl()) payload.logoUrl = this.logoUrl()
    if (this.theme()) payload.theme = this.theme()
    this.tenantService.updateSettings(this.tenantId(), payload).subscribe({
      next: (data) => {
        this.tenantInfo.update(current => ({
          ...current,  
          ...data     
        }));
        this.toastr.success('Data updated successfully!', 'Success');              
      },
      error: () => {
        this.toastr.error('Unable to update details!', 'Error');              
        this.isLoading = false;
      }
    });
  }
  constructor(private toastr : ToastrService){

  }
}