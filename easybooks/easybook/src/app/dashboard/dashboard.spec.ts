import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dashboard tab active', () => {
    expect(component.activeTab).toBe('dashboard');
  });

  it('should change active tab', () => {
    component.setActiveTab('accounts');
    expect(component.activeTab).toBe('accounts');
  });

  it('should return correct tab title', () => {
    component.activeTab = 'accounts';
    expect(component.getTabTitle()).toBe('Accounts Management');
  });

  it('should have dashboard stats', () => {
    expect(component.dashboardStats.length).toBe(4);
    expect(component.dashboardStats[0].type).toBe('income');
  });

  it('should have recent transactions', () => {
    expect(component.recentTransactions.length).toBeGreaterThan(0);
  });

  it('should handle logout confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'log');
    component.logout();
    expect(console.log).toHaveBeenCalledWith('Logging out...');
  });
});