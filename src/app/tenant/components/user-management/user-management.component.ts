import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { AuthService, User } from '../../../auth/services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ConfigService } from '../../../shared/services/config.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  imports: [NgIf, MatIconModule, FormsModule, MatError,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ])
  ]
})
export class UserManagementComponent implements OnInit {
  userManagementService = inject(UserManagementService)
  authService = inject(AuthService)
  configService = inject(ConfigService)

  tenantId = this.authService.tenantId
  formState = 'out';
  isEditId = ''
  userList = signal<User[]>([])
  userRoles = this.configService.userRoles
  name = signal('');
  email = signal('');
  password = signal('');
  role = signal('Admin');
  status = signal(true);

  userPayload = computed(() => {
    return {
      name: this.name(),
      email: this.email(),
      password: this.password(),
      role: this.role(),
      active: this.status(),
      tenantId: this.tenantId()
    }
  }
  )
  isEmailInvalid = computed(() => {
    return this.email() && /^\S+@\S+\.\S+$/.test(this.email());
  });

  isFormValid = computed(() => {
    return !!this.name()?.trim() &&
      !!this.isEmailInvalid() &&
      !!this.password()?.trim()
  });

  toggleForm() {
    this.formState = this.formState === 'out' ? 'in' : 'out';
    this.isEditId = ''
    this.name.set('')
    this.email.set('')
    this.password.set('')
    this.role.set('Admin')
    this.status.set(true)
  }

  saveUser() {
    if (this.isFormValid()) {
      this.userManagementService.createNewUser(this.userPayload()).subscribe({
        next: (data) => {
          this.userList.update(users => [...users, data]);
          this.toggleForm()
          this.toastr.success('User Created!', 'Success');
        },
        error: (err) => {
          this.toastr.error('Failed to create Users', 'Error');
          console.error('Failed to create Users:', err);
        }
      })
    } else {
      this.toastr.error('Please fill all fields', 'Error');
    }
  }

  getRoleName(roleId: string | number): string {
    const role = this.userRoles.find(r => r.id == roleId);
    return role ? role.name : 'N/A';
  }

  onEdit(user: any) {
    this.toggleForm()
    this.name.set(user.name)
    this.email.set(user.email)
    this.password.set(user.password)
    this.role.set(user.role)
    this.status.set(user.active)
    this.isEditId = user.id
  }

   onDelete(userId: any): void {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userManagementService.deleteUser(userId).subscribe({
            next: (data) => {
              this.toastr.success('User deleted!', 'Success');              
              const updatedList = this.userList().filter(user => user.id !== userId)
              this.userList.set(updatedList)
            },
            error: (err) => {
              this.toastr.error('Failed to delete user', 'Error');              
              console.error('Failed to delete Users:', err);
            }
          })
        }
      });
    }
  onUpdate() {
    this.userManagementService.updateUser(this.isEditId,this.userPayload()).subscribe({
      next: (data) => {
        const updatedList = this.userList().map(user => user.id !== this.isEditId? user : {...data})
        this.userList.set(updatedList)
        this.toggleForm()
        this.toastr.success('User updated!', 'Success');              

      },
      error: (err) => {
        this.toastr.error('Failed to update user', 'Error');              
        console.error('Failed to fetch Users:', err);
      }
    })
  }
  ngOnInit(): void {
    this.userManagementService.fetchUsers(this.tenantId()).subscribe({
      next: (data) => {
        this.userList.set(data)
      },
      error: (err) => {
        console.error('Failed to fetch Users:', err);
      }
    });
  }
  constructor(private dialog: MatDialog , private toastr: ToastrService) {

  }
}
