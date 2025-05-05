import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../auth/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) {

  }

  fetchUsers(tenantId: string) {
    return this.http.get<User[]>('http://localhost:3000/users?tenantId=' + tenantId)
  }
  createNewUser(userPayload: any){
    return this.http.post<any>('http://localhost:3000/users',userPayload)
  }
  deleteUser(userId: any){
    return this.http.delete<any>('http://localhost:3000/users/'+userId)
  }
  updateUser(id:string, userPayload: any){
    return this.http.put<any>('http://localhost:3000/users/'+id,userPayload)
  }
}
