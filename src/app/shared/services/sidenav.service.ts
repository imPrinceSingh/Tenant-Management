import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  isSideNavOpen = signal<boolean>(false);
  features = signal<Array<any>>([])
  tenantInfo = signal<any>({})

  toggleSideNav(){
    this.isSideNavOpen.update((current)=>!current)
  }
  getTenantInfo(id: string){
   return this.http.get<Array<any>>(`http://localhost:3000/tenants/${id}`)

  }
  getEnabledFeature(tenantId: string) {
    return this.getTenantInfo(tenantId).pipe(
      switchMap((data) => {
        this.tenantInfo.set(data)
        return this.http.get<Array<any>>(`http://localhost:3000/features?tenantId=${tenantId}`);
      })
    );
  }

  constructor(private http: HttpClient) { }
}
