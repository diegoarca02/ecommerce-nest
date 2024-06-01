import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionClientesComponent } from './direccion-clientes.component';

describe('DireccionClientesComponent', () => {
  let component: DireccionClientesComponent;
  let fixture: ComponentFixture<DireccionClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DireccionClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DireccionClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
