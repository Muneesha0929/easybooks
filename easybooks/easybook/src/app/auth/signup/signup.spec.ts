import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password matching', () => {
    component.signupData.password = 'password123';
    component.signupData.confirmPassword = 'password123';
    expect(component.passwordsMatch()).toBeTruthy();

    component.signupData.confirmPassword = 'different';
    expect(component.passwordsMatch()).toBeFalsy();
  });

  it('should validate form completion', () => {
    component.signupData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      companyName: 'Test Company',
      password: 'password123',
      confirmPassword: 'password123',
      agreeTerms: true
    };
    expect(component.isFormValid()).toBeTruthy();
  });
});