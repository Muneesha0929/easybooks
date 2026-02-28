import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class Profile implements OnInit {

  currentUser: User | null = null;
  isLoading = true;

  journalCount = 0;
  daysActive = 0;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUser();
    this.loadStats();
  }

  loadUser() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.calculateDaysActive(user);
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:5000/api/journal', { headers })
      .subscribe(res => {
        this.journalCount = res.entries?.length || 0;
      });
  }

  calculateDaysActive(user: any) {
    if (!user.createdAt) {
      this.daysActive = 1;
      return;
    }

    const created = new Date(user.createdAt).getTime();
    const now = Date.now();

    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    this.daysActive = diff || 1;
  }

  getMemberSince() {
    if (!this.currentUser?.createdAt) return 'Recently joined';

    const date = new Date(this.currentUser.createdAt);
    return date.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  }
}