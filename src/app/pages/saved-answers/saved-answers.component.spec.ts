import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAnswersComponent } from './saved-answers.component';

describe('FaqComponent', () => {
  let component: SavedAnswersComponent;
  let fixture: ComponentFixture<SavedAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedAnswersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
