import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface JournalEntry {
  _id?: string;
  date: string;
  accountName: string;
  debit: number;
  credit: number;
  narration: string;
  createdAt?: string;
}

@Component({
  selector: 'app-view-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-journal.component.html',
  styleUrls: ['./view-journal.component.css']
})
export class ViewJournal implements OnInit {
  journalEntries: JournalEntry[] = [];
  filteredEntries: JournalEntry[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadJournalEntries();
  }

  loadJournalEntries() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<{success: boolean, entries: JournalEntry[]}>('http://localhost:5000/api/journal').subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.journalEntries = response.entries;
          this.filteredEntries = response.entries;
          console.log('Journal entries loaded:', this.journalEntries);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Load error:', error);
        this.errorMessage = error.error?.message || 'Failed to load journal entries';
      }
    });
  }

  searchEntries() {
    if (!this.searchTerm) {
      this.filteredEntries = this.journalEntries;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEntries = this.journalEntries.filter(entry => 
      entry.accountName.toLowerCase().includes(term) ||
      entry.narration.toLowerCase().includes(term) ||
      entry.date.includes(term)
    );
  }

  navigateToAddJournal() {
    this.router.navigate(['/dashboard/add-journal']);
  }

  editEntry(entryId: string) {
    console.log('Edit entry:', entryId);
    // TODO: Navigate to edit page or open edit modal
    alert('Edit functionality coming soon!');
  }

  deleteEntry(entryId: string) {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    this.http.delete(`http://localhost:5000/api/journal/${entryId}`).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('Entry deleted successfully');
          this.loadJournalEntries(); // Reload the list
        }
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert(error.error?.message || 'Failed to delete entry');
      }
    });
  }

  formatCurrency(amount: number): string {
    return amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : '-';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  }
}
