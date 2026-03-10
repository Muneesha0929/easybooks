import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class Profile implements OnInit {

  currentUser: User | null = null;
  editableUser: User | null = null;
  isLoading = true;

  isEditing = false;
  isChangingPassword = false;
  newPassword = '';
  confirmPassword = '';

  profilePhoto: string | null = null;

  // Statistics
  journalCount = 0;
  reportsGenerated = 0;
  exportsCount = 0;
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
        this.currentUser = { ...user };
        this.editableUser = { ...user };
        this.calculateDaysActive(user);
        this.isLoading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = true;
  }

  saveProfile() {
    if (!this.editableUser) return;

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(
      'http://localhost:5000/api/auth/user',
      this.editableUser,
      { headers }
    ).subscribe(res => {

      alert('Profile updated successfully');
      this.currentUser = { ...this.editableUser! };
      this.isEditing = false;

    }, err => {

      console.error(err);
      alert(err.error?.message || 'Failed to update profile');

    });
  }

  toggleChangePassword() {
    this.isChangingPassword = !this.isChangingPassword;
  }

  changePassword() {

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(
      'http://localhost:5000/api/auth/user/change-password',
      { newPassword: this.newPassword },
      { headers }
    ).subscribe(res => {

      alert('Password updated successfully');
      this.newPassword = '';
      this.confirmPassword = '';
      this.isChangingPassword = false;

    }, err => {

      console.error(err);
      alert(err.error?.message || 'Failed to change password');

    });
  }

  onPhotoSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.profilePhoto = e.target.result;
    };

    reader.readAsDataURL(file);

    const token = localStorage.getItem('token') || '';
    const formData = new FormData();
    formData.append('photo', file);

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<any>(
  'http://localhost:5000/api/auth/upload-photo',
  formData,
  { headers }
).subscribe(res => {

  if(res.photo){
    this.profilePhoto = 'http://localhost:5000' + res.photo;
  }

  alert('Profile photo updated successfully');

}, err => {

      console.error(err);
      alert(err.error?.message || 'Failed to upload photo');

    });
  }

  loadStats() {

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(
      'http://localhost:5000/api/journal',
      { headers }
    ).subscribe(res => {

      this.journalCount = res.entries?.length || 0;
      this.reportsGenerated = res.reports?.length || 0;
      this.exportsCount = res.exports?.length || 0;

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