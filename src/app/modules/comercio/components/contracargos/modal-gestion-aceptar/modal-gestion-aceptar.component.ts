import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContracargoComercio } from 'src/models/contracargos/Contracargo';
import { CambioEstadoService } from 'src/app/modules/comercio/services/cambio-estado.service';
import { CambioEstadoComercio } from 'src/models/CambioEstado';

@Component({
  selector: 'app-modal-gestion-aceptar',
  templateUrl: './modal-gestion-aceptar.component.html',
  styleUrls: ['./modal-gestion-aceptar.component.css'],
})
export class ModalGestionAceptarComponent implements OnInit {
  @Output() closeWindow = new EventEmitter<void>();
  @Output() cancelOperation = new EventEmitter<void>();
  @Input() contracargo!: ContracargoComercio;

  readonly TEMP_USUARIO_ID = 117;
  readonly TEMP_ROL_ID = 2;

  constructor(private cambioEstadoService: CambioEstadoService) {}
  ngOnInit(): void {
    this.paramsAceptar.id = this.contracargo.caso;
  }

  cambioEstado = false;
  loadingCambioEstado = true;
  mensajeResultadoOperacion = '';
  successfulUpdate = false;
  paramsAceptar: CambioEstadoComercio = {
    usuario_id: this.TEMP_USUARIO_ID,
    rol_id: this.TEMP_ROL_ID,
    id: 0,
  };

  async aceptarContracargo() {
    this.loadingCambioEstado = true;
    this.cambioEstado = true;
    let result = await this.cambioEstadoService.aceptarContracargo(
      this.paramsAceptar
    );
    let message;
    if (result.status !== 'OK') {
      this.successfulUpdate = false;
      message = result.message ?? 'Ocurrio un error desconocido';
    } else {
      this.contracargo.estado = 'Nuevo Estado';
      this.successfulUpdate = true;
      message = 'Operacion Exitosa!';
    }
    this.loadingCambioEstado = false;
    this.mensajeResultadoOperacion = message;
  }
  closeModal() {
    this.closeWindow.emit();
  }
  cancelarGestion() {
    this.cancelOperation.emit();
  }
}
