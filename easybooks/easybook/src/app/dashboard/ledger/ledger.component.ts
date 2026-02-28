import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface JournalEntry {
  accountName: string;
  debit: number;
  credit: number;
}

interface LedgerRow {
  accountName: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
  type: string;
}

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class Ledger implements OnInit {

  ledgerData: LedgerRow[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLedger();
  }

  loadLedger() {
    this.isLoading = true;

    this.http.get<{success: boolean, entries: JournalEntry[]}>('http://localhost:5000/api/journal')
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.generateLedger(res.entries);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load ledger';
          console.error(err);
        }
      });
  }

  generateLedger(entries: JournalEntry[]) {
    const map: { [key: string]: LedgerRow } = {};

    entries.forEach(e => {
      if (!map[e.accountName]) {
        map[e.accountName] = {
          accountName: e.accountName,
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          type: this.getAccountType(e.accountName)
        };
      }

      map[e.accountName].totalDebit += e.debit || 0;
      map[e.accountName].totalCredit += e.credit || 0;
    });

    // Calculate balances
    this.ledgerData = Object.values(map).map(acc => ({
      ...acc,
      balance: acc.totalDebit - acc.totalCredit
    }));
  }

  getAccountType(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('cash') || n.includes('bank')) return 'Asset';
    if (n.includes('sales')) return 'Revenue';
    return 'Expense';
  }

  formatCurrency(val: number) {
    return val ? `₹${val.toLocaleString('en-IN')}` : '₹0';
  }
}