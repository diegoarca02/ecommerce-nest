import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideClientesComponent } from './aside-clientes.component';

describe('AsideClientesComponent', () => {
  let component: AsideClientesComponent;
  let fixture: ComponentFixture<AsideClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
