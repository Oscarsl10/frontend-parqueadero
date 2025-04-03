import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeAdminComponent } from './fee-admin.component';

describe('FeeAdminComponent', () => {
  let component: FeeAdminComponent;
  let fixture: ComponentFixture<FeeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
