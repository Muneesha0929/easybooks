import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LedgerItem {
  account: string;
  accountType: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export interface BalanceSheetData {
  assets: Array<{ account: string; balance: number }>;
  liabilities: Array<{ account: string; balance: number }>;
  equity: Array<{ account: string; balance: number }>;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface ProfitLossData {
  revenue: Array<{ account: string; amount: number }>;
  expenses: Array<{ account: string; amount: number }>;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:5000/api/journal';

  constructor(private http: HttpClient) {}

  getLedger(): Observable<{ success: boolean; data: LedgerItem[] }> {
    return this.http.get<{ success: boolean; data: LedgerItem[] }>(`${this.apiUrl}/ledger`);
  }

  getBalanceSheet(): Observable<{ success: boolean; data: BalanceSheetData }> {
    return this.http.get<{ success: boolean; data: BalanceSheetData }>(`${this.apiUrl}/balance-sheet`);
  }

  getProfitLoss(): Observable<{ success: boolean; data: ProfitLossData }> {
    return this.http.get<{ success: boolean; data: ProfitLossData }>(`${this.apiUrl}/profit-loss`);
  }
}
