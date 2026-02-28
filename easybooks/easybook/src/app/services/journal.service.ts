import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JournalEntry {
  _id?: string;
  date: Date | string;
  account: string;
  accountType: 'Asset' | 'Liability' | 'Revenue' | 'Expense' | 'Equity';
  debit: number;
  credit: number;
  narration: string;
  createdAt?: Date;
}

export interface JournalResponse {
  success: boolean;
  data?: JournalEntry | JournalEntry[];
  count?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'http://localhost:5000/api/journal';

  constructor(private http: HttpClient) {}

  getAllEntries(): Observable<JournalResponse> {
    return this.http.get<JournalResponse>(this.apiUrl);
  }

  createEntry(entry: JournalEntry): Observable<JournalResponse> {
    return this.http.post<JournalResponse>(this.apiUrl, entry);
  }

  updateEntry(id: string, entry: Partial<JournalEntry>): Observable<JournalResponse> {
    return this.http.put<JournalResponse>(`${this.apiUrl}/${id}`, entry);
  }

  deleteEntry(id: string): Observable<JournalResponse> {
    return this.http.delete<JournalResponse>(`${this.apiUrl}/${id}`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }
}
