import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheet implements OnInit {

  entries: any[] = [];
  accounts: any[] = [];

  totalAssets = 0;
  totalLiabilities = 0;
  netWorth = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:5000/api/journal', { headers })
      .subscribe(res => {
        this.entries = res.entries || [];
        this.calculateBalances();
      });
  }

  calculateBalances() {
    const map: any = {};

    this.entries.forEach(e => {
      const name = e.accountName;

      if (!map[name]) {
        map[name] = { name, debit: 0, credit: 0 };
      }

      map[name].debit += e.debit || 0;
      map[name].credit += e.credit || 0;
    });

    this.accounts = Object.values(map);

    // Calculate totals
    this.totalAssets = 0;
    this.totalLiabilities = 0;

    this.accounts.forEach((acc: any) => {
      const balance = acc.debit - acc.credit;

      if (balance > 0) {
        this.totalAssets += balance;
      } else {
        this.totalLiabilities += Math.abs(balance);
      }
    });

    this.netWorth = this.totalAssets - this.totalLiabilities;
  }

  getBalance(acc: any) {
    return acc.debit - acc.credit;
  }
}