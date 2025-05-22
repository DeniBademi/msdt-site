import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableDisplayComponent } from './variable-display.component';

describe('VariableDisplayComponent', () => {
  let component: VariableDisplayComponent;
  let fixture: ComponentFixture<VariableDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariableDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
