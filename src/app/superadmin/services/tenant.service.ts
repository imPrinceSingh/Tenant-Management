import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';
import { Tenant } from '../components/tenant/tenant.component';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  configService = inject(ConfigService)
  tenantList = signal<Tenant[]>([])

  featurePayload = computed(()=> 
    this.configService.features().reduce((acc, feature) => {
      acc[feature.id] = feature.enabled;
      return acc;
    }, {} as Record<string, boolean>)
  )
  registerTenant(tenantPayload: any, userPayload: any) {
    return this.http.post<any>('http://localhost:3000/tenants', tenantPayload).pipe(
      switchMap((createdTenant) => {
        const userWithTenantId = {
          ...userPayload,
          tenantId: createdTenant.id // attach the generated tenant ID to the user
        };
        const featureWithTenantId = {
          ...this.featurePayload(),
          tenantId: createdTenant.id
        };
        return this.http.post<any>('http://localhost:3000/users', userWithTenantId).pipe(
          switchMap((createdUser) => {
            return this.http.post('http://localhost:3000/features', featureWithTenantId);
          })
        );
      }
      )
    )
  }
  updateTenant(tenantId: string, userId: string, featuresId: string, tenantPayload: any, userPayload: any) {
    return this.http.put<any>(`http://localhost:3000/tenants/${tenantId}`, tenantPayload).pipe(
      switchMap((updatedTenant) => {
        const userWithTenantId = {
          ...userPayload,
          tenantId
        };
        const featureWithTenantId = {
          ...this.featurePayload(),
          tenantId
        };
        return this.http.put<any>(`http://localhost:3000/users/${userId}`, userWithTenantId).pipe(
          switchMap((updatedUser) => {

            return this.http.put(`http://localhost:3000/features/${featuresId}`,featureWithTenantId);
          })
        );
      }
      )
    )
  }
  getTenantById(id: string) {
    return this.http.get<any>(`http://localhost:3000/tenants/${id}`);
  }

  getAdminByTenantId(tenantId: string) {
    return this.http.get<any>(`http://localhost:3000/users?tenantId=${tenantId}`);
  }

  getFeaturesByTenantId(tenantId: string) {
    return this.http.get<any>(`http://localhost:3000/features?tenantId=${tenantId}`);
  }

  getAllTenantData(tenantId: string) {
    return forkJoin({
      tenant: this.getTenantById(tenantId),
      admin: this.getAdminByTenantId(tenantId),
      features: this.getFeaturesByTenantId(tenantId),
    });
  }
  constructor(private http: HttpClient) { }

}
