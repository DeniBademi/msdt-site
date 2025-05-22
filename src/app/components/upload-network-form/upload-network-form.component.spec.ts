import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNetworkFormComponent } from './upload-network-form.component';

describe('UploadNetworkFormComponent', () => {
  let component: UploadNetworkFormComponent;
  let fixture: ComponentFixture<UploadNetworkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadNetworkFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadNetworkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
