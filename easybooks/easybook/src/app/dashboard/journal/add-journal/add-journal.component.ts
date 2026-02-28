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
  // Form data model
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
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    this.journalEntry.date = today;
  }

  onSubmit() {
    // Validation
    if (!this.journalEntry.date || !this.journalEntry.accountName || !this.journalEntry.narration) {
      alert('Please fill all required fields');
      return;
    }

    if (this.journalEntry.debit === 0 && this.journalEntry.credit === 0) {
      alert('Please enter either debit or credit amount');
      return;
    }

    if (this.journalEntry.debit > 0 && this.journalEntry.credit > 0) {
      alert('Please enter only debit OR credit, not both');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Call backend API
    this.http.post('http://localhost:5000/api/journal', this.journalEntry).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.success) {
          alert('Journal entry saved successfully!');
          console.log('Entry saved:', response);
          
          // Reset form
          this.resetForm();
          
          // Navigate to view journal
          this.router.navigate(['/dashboard/view-journal']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Save error:', error);
        this.errorMessage = error.error?.message || 'Failed to save journal entry';
        alert(this.errorMessage);
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
