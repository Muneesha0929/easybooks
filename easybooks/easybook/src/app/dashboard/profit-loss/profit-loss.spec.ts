import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLoss } from './profit-loss.component';

describe('ProfitLoss', () => {
  let component: ProfitLoss;
  let fixture: ComponentFixture<ProfitLoss>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfitLoss]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitLoss);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
