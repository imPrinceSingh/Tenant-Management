import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  updateSettings(tenantId: string, payload: any) {
    return this.http.patch('http://localhost:3000/tenants/' + tenantId, payload)
  }
  constructor(public http: HttpClient) { }
}
