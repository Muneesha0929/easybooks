import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface User {
  name: string;
  email: string;
  company: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  currentUser: User = {
    name: 'Guest User',
    email: 'guest@example.com',
    company: 'Free Account'
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Load user if available (no force redirect)
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = {
          name: user.name,
          email: user.email,
          company: user.accountType === 'Premium'
            ? 'Premium Account'
            : 'Free Account'
        };
      } else {
        console.log('No active user session found (development mode)');
        // Do NOT redirect to login
      }
    });
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}