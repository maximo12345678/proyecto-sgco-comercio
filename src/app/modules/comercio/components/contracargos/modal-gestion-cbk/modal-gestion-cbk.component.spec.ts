import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionCbkComponent } from './modal-gestion-cbk.component';

describe('ModalGestionCbkComponent', () => {
  let component: ModalGestionCbkComponent;
  let fixture: ComponentFixture<ModalGestionCbkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGestionCbkComponent]
    });
    fixture = TestBed.createComponent(ModalGestionCbkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
