import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJournal } from './add-journal';

describe('AddJournal', () => {
  let component: AddJournal;
  let fixture: ComponentFixture<AddJournal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJournal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJournal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
