import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-journal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-journal.component.html',
  styleUrls: ['./add-journal.component.css']
})
export class AddJournal {

  journalEntry = {
    date: '',
    accountName: '',
    debit: 0,
    credit: 0,
    narration: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.journalEntry.date = today;
  }

  // Auto clear credit if debit entered
  onDebitChange() {
    if (this.journalEntry.debit > 0) {
      this.journalEntry.credit = 0;
    }
  }

  // Auto clear debit if credit entered
  onCreditChange() {
    if (this.journalEntry.credit > 0) {
      this.journalEntry.debit = 0;
    }
  }

  onSubmit() {
    if (!this.journalEntry.date || !this.journalEntry.accountName || !this.journalEntry.narration) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.journalEntry.debit === 0 && this.journalEntry.credit === 0) {
      this.errorMessage = 'Enter either money received OR money spent';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('http://localhost:5000/api/journal', this.journalEntry)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            alert('✅ Journal entry saved!');
            this.resetForm();
            this.router.navigate(['/dashboard/view-journal']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to save entry';
        }
      });
  }

  resetForm() {
    const today = new Date().toISOString().split('T')[0];
    this.journalEntry = {
      date: today,
      accountName: '',
      debit: 0,
      credit: 0,
      narration: ''
    };
  }
}