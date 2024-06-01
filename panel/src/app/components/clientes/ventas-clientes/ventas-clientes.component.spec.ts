import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasClientesComponent } from './ventas-clientes.component';

describe('VentasClientesComponent', () => {
  let component: VentasClientesComponent;
  let fixture: ComponentFixture<VentasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
