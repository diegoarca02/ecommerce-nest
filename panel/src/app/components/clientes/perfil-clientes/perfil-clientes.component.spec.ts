import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilClientesComponent } from './perfil-clientes.component';

describe('PerfilClientesComponent', () => {
  let component: PerfilClientesComponent;
  let fixture: ComponentFixture<PerfilClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
