import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVentaClientesComponent } from './detalle-venta-clientes.component';

describe('DetalleVentaClientesComponent', () => {
  let component: DetalleVentaClientesComponent;
  let fixture: ComponentFixture<DetalleVentaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVentaClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleVentaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
