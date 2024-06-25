import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionAceptarComponent } from './modal-gestion-aceptar.component';

describe('ModalGestionAceptarComponent', () => {
  let component: ModalGestionAceptarComponent;
  let fixture: ComponentFixture<ModalGestionAceptarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGestionAceptarComponent]
    });
    fixture = TestBed.createComponent(ModalGestionAceptarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
