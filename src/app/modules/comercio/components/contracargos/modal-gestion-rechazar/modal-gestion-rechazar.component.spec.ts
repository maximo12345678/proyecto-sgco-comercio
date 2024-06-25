import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionRechazarComponent } from './modal-gestion-rechazar.component';

describe('ModalGestionRechazarComponent', () => {
  let component: ModalGestionRechazarComponent;
  let fixture: ComponentFixture<ModalGestionRechazarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGestionRechazarComponent]
    });
    fixture = TestBed.createComponent(ModalGestionRechazarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
