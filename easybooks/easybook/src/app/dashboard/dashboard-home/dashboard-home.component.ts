import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  date: Date;
  description: string;
  type: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {

  // Empty stats (will load from backend later)
  dashboardStats: any[] = [];

  // Empty transactions
  recentTransactions: Transaction[] = [];

  constructor() {}

  ngOnInit(): void {
    // Later we will load real data here
    console.log('Dashboard loaded - no dummy data');
  }
}