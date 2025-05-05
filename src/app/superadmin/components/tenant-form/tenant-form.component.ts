import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TenantService } from '../../services/tenant.service';
import { MatCardModule } from '@angular/material/card';
import { ConfigService } from '../../../shared/services/config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class TenantFormComponent {
  tenantId = ''
  userId = ''
  featuresId = ''
  selectedFile: File | null = null

  constructor(private router: Router, private toastr: ToastrService) {
    this.tenantId = this.router.getCurrentNavigation()?.extras?.state?.['tenantId'];
    if (this.tenantId) {
      this.tenantService.getAllTenantData(this.tenantId).subscribe({
        next: ({ tenant, admin, features }) => {
          console.log(tenant, admin, features)
          this.tenantName.set(tenant.name || '');
          this.email.set(tenant.email || '');
          this.phoneNumber.set(tenant.phoneNumber || '');
          this.industry.set(tenant.industry || '');
          this.logoUrl.set(tenant.logoUrl || '');
          this.theme.set(tenant.theme || '');
          this.status.set(tenant.status || '');
          this.adminName.set(admin[0]?.name || '')
          this.adminEmail.set(admin[0]?.email || '')
          this.adminPassword.set(admin[0]?.password || '')
          this.userId = admin[0]?.id
          this.featuresId = features[0]?.id
          this.features.update(currentFeatures =>
            currentFeatures.map(feature =>
            ({
              ...feature,
              enabled: features[0].hasOwnProperty(feature.id) ? features[0][feature.id] : feature.enabled
            }))
          );
          this.selectedFile = this.configService.base64ToFile(tenant.logoUrl, 'uploaded-image.png');
        },
        error: (err) => {
          console.error('Failed to fetch tenant:', err);
        }
      });
    }
  }
  tenantService = inject(TenantService)
  configService = inject(ConfigService)

  features = this.configService.features
  tenantName = signal('');
  email = signal('');
  phoneNumber = signal('');
  industry = signal('');
  adminName = signal('');
  adminEmail = signal('');
  adminPassword = signal('');
  logoUrl = signal('');
  theme = signal('#3b82f6');
  status = signal('Active');
  previewUrl = signal('')

  presetThemes = [
    { name: 'Light', color: '#f8fafc' },
    { name: 'Warm', color: '#fef3c7' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Dark', color: '#1e293b' },
    { name: 'Dark Blue', color: '#1e40af' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Black', color: '#000000' },
    // { name: 'Magenta', color: '#d946ef' },  
    // { name: 'Pink', color: '#ec4899' }        
  ];


  isEmailInvalid = computed(() => {
    return this.email() && /^\S+@\S+\.\S+$/.test(this.email());
  });
  isAdminEmailInvalid = computed(() => {
    return this.adminEmail() && /^\S+@\S+\.\S+$/.test(this.adminEmail());
  })
  // Form validity 
  isFormValid = computed(() => {
    return !!this.tenantName()?.trim() &&
      !this.isEmailInvalid() &&
      !!this.adminName()?.trim() &&
      !this.isAdminEmailInvalid() &&
      !!this.adminPassword()?.trim();
  });

  tenantPayload = computed(() => {
    return {
      name: this.tenantName(),
      email: this.email(),
      phoneNumber: this.phoneNumber(),
      industry: this.industry(),
      logoUrl: this.logoUrl(),
      theme: this.theme(),
      status: this.status(),
      enabled: true
    }
  })
  userPayload = computed(() => {
    return {
      name: this.adminName(),
      email: this.adminEmail(),
      password: this.adminPassword(),
      role: 'Admin'
    }
  })

  updateThemeColor(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input)
    this.theme.set(input.value);
  }
  submitForm(tenantId: any) {
    if (this.isFormValid()) { this.toastr.error('Please fill all required field!', 'Error'); return }
    if (tenantId) {
      this.tenantService.updateTenant(tenantId, this.userId, this.featuresId, this.tenantPayload(), this.userPayload()).subscribe({
        next: (response) => {
          this.clearForm()
          this.router.navigate(['/tenant'])
          this.toastr.success('Tenant has been updated successfully', 'Success')
        },
        error: (err) => {
          this.toastr.error('Error while updating tenant', 'Error')
          console.error('Error in updating tenant:', err);
        }
      });
    } else {
      this.tenantService.registerTenant(this.tenantPayload(), this.userPayload()).subscribe({
        next: (response) => {
          this.clearForm()
          this.router.navigate(['/tenant'])
          this.toastr.success('Tenant has been added successfully', 'Success')
        },
        error: (err) => {
          this.toastr.error('Error while creating tenant', 'Error')
          console.error('Error registering tenant:', err);
        }
      });
    }

  }
  toggleFeature(featureId: string) {
    this.features.update(currentFeatures =>
      currentFeatures.map(feature =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  }
  updateTheme(value: string) {
    // Validate hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      this.theme.set(value);
    }
  }
  onFileSelected(event: Event) {
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
  goBack() {
    this.router.navigate(['/tenant']);
  }
  clearFile() {
    this.selectedFile = null;
    this.logoUrl.set('')
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  }
  clearForm() {
    this.tenantName.set('');
    this.email.set('');
    this.phoneNumber.set('');
    this.industry.set('');
    this.logoUrl.set('');
    this.theme.set('');
    this.status.set('');
    this.adminName.set('')
    this.adminEmail.set('')
    this.adminPassword.set('')
  }
}