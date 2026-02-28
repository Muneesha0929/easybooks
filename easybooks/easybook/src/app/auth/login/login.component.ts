import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.loginData.email && this.loginData.password) {
      this.isLoading = true;
      this.errorMessage = '';

      // Call the REAL backend API
      this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            alert('Login successful!');
            console.log('User logged in:', response.user);
            console.log('Token saved:', localStorage.getItem('token'));
            
            // ✅ IMPORTANT: Small delay to ensure token is saved
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 150);
          } else {
            this.errorMessage = response.message || 'Login failed';
            alert(this.errorMessage);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
          alert(this.errorMessage);
        }
      });
    } else {
      alert('Please enter both email and password');
    }
  }

  navigateToSignup(event: Event) {
    event.preventDefault();
    console.log('Navigate to signup');
    this.router.navigate(['/signup']);
  }
}
