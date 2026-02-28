import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupData = {
    fullName: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.errorMessage = '';

      // Call the REAL backend API
      this.authService.register(
        this.signupData.fullName,
        this.signupData.email,
        this.signupData.password
      ).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            alert('Account created successfully! Welcome to EasyBooks.');
            console.log('User registered:', response.user);
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Registration failed';
            alert(this.errorMessage);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Signup error:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          alert(this.errorMessage);
        }
      });
    } else {
      if (!this.passwordsMatch()) {
        alert('Passwords do not match!');
      } else if (!this.signupData.agreeTerms) {
        alert('Please agree to the terms and conditions');
      } else {
        alert('Please fill all required fields');
      }
    }
  }

  passwordsMatch(): boolean {
    if (!this.signupData.password || !this.signupData.confirmPassword) {
      return true;
    }
    return this.signupData.password === this.signupData.confirmPassword;
  }

  isFormValid(): boolean {
    return this.signupData.fullName.trim() !== '' &&
           this.signupData.email.trim() !== '' &&
           this.signupData.password.trim() !== '' &&
           this.signupData.confirmPassword.trim() !== '' &&
           this.passwordsMatch() &&
           this.signupData.agreeTerms;
  }

  navigateToLogin() {
    console.log('Navigate to login');
    this.router.navigate(['/login']);
  }
}
