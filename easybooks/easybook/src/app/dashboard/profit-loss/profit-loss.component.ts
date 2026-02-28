import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLoss implements OnInit {

  incomes: any[] = [];
  expenses: any[] = [];

  totalIncome = 0;
  totalExpense = 0;
  netProfit = 0;

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
        const entries = res.entries || [];

        const incomeMap: any = {};
        const expenseMap: any = {};

        entries.forEach((e: any) => {
          if (e.credit > 0) {
            incomeMap[e.accountName] = (incomeMap[e.accountName] || 0) + e.credit;
            this.totalIncome += e.credit;
          }

          if (e.debit > 0) {
            expenseMap[e.accountName] = (expenseMap[e.accountName] || 0) + e.debit;
            this.totalExpense += e.debit;
          }
        });

        this.incomes = Object.entries(incomeMap).map(([name, amount]) => ({ name, amount }));
        this.expenses = Object.entries(expenseMap).map(([name, amount]) => ({ name, amount }));

        this.netProfit = this.totalIncome - this.totalExpense;
      });
  }
}