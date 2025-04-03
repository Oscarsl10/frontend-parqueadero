import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaAdminComponent } from './tarifa-admin.component';

describe('TarifaAdminComponent', () => {
  let component: TarifaAdminComponent;
  let fixture: ComponentFixture<TarifaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
