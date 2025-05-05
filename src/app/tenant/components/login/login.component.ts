import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, NgIf]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onSubmit(): void {
    this.authService.tenantLogin(this.email, this.password).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.toastr.success('Login Successful!', 'Success');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Invalid credentials!', 'Error');
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: (err) => {
        this.errorMessage = 'Login failed. Please try again.';
        this.toastr.error('Login failed. Please try again.', 'Error');
        console.error('Login error:', err);
      }
    });
  }
}
