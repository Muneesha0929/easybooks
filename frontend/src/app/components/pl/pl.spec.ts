import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pl } from './pl';

describe('Pl', () => {
  let component: Pl;
  let fixture: ComponentFixture<Pl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
