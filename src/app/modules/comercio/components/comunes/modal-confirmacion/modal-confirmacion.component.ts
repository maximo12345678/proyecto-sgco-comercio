import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.css'],
})
export class ModalConfirmacionComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Output() confirmAction = new EventEmitter();
  @Output() cancelOperation = new EventEmitter();

  onCancelOperation() {
    this.cancelOperation.emit();
  }

  onConfirmAction() {
    this.confirmAction.emit();
  }
}
