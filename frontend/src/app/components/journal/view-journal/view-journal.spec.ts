import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJournal } from './view-journal';

describe('ViewJournal', () => {
  let component: ViewJournal;
  let fixture: ComponentFixture<ViewJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJournal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
