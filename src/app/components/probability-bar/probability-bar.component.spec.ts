import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbabilityBarComponent } from './probability-bar.component';

describe('ProbabilityBarComponent', () => {
  let component: ProbabilityBarComponent;
  let fixture: ComponentFixture<ProbabilityBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProbabilityBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbabilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
