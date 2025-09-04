import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddJournalComponent } from './components/journal/add-journal/add-journal.component';
import { ViewJournalComponent } from './components/journal/view-journal/view-journal.component';
import { LedgerComponent } from './components/ledger/ledger.component';
import { PlComponent } from './components/pl/pl.component';
import { BalanceComponent } from './components/balance/balance.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'journal/add', component: AddJournalComponent },
  { path: 'journal/view', component: ViewJournalComponent },
  { path: 'ledger', component: LedgerComponent },
  { path: 'pl', component: PlComponent },
  { path: 'balance', component: BalanceComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '/login' } // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
