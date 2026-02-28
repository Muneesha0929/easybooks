// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { AddJournal } from './dashboard/journal/add-journal/add-journal.component';
import { ViewJournal } from './dashboard/journal/view-journal/view-journal.component';
import { Ledger } from './dashboard/ledger/ledger.component';
import { ProfitLoss } from './dashboard/profit-loss/profit-loss.component';
import { BalanceSheet } from './dashboard/balance-sheet/balance-sheet.component';
import { Profile } from './dashboard/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component:DashboardHomeComponent },
      { path: 'add-journal', component: AddJournal },
      { path: 'view-journal', component: ViewJournal },
      { path: 'ledger', component: Ledger },
      { path: 'profit-loss', component: ProfitLoss },
      { path: 'balance-sheet', component: BalanceSheet },
      { path: 'profile', component: Profile }
    ]
  }
];
