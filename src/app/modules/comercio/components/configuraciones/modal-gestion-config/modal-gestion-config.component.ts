import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatearMonto } from 'src/app/utils';
import { Comercio } from 'src/models/comercio/Comercio';
import { Subcomercio } from 'src/models/comercio/GetSubcomercios';
import { SubcomerciosService } from '../../../services/subcomercios.service';
import { ParametroPutSubcomercios } from 'src/models/comercio/PutSubcomercios';
import { VariablesGlobalesService } from 'src/app/modules/comunes/services/variables-globales.service';
import { Usuario } from 'src/models/Usuario';

export interface ConfigOutput {
  id: number;
  monto: number;
}

@Component({
  selector: 'app-modal-gestion-config',
  templateUrl: './modal-gestion-config.component.html',
  styleUrls: ['./modal-gestion-config.component.css'],
})
export class ModalGestionConfigComponent implements OnInit {
  constructor(
    private subcomerciosService: SubcomerciosService,
    private dataStorageService: VariablesGlobalesService
  ) {}

  ngOnInit(): void {
    let { status, usuario } = this.dataStorageService.getUsuarioStorage();
    if (status) {
      this.userData = usuario;
    }
    this.montoInput = this.subcomercio.montoMinimo.toString();
  }

  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() subcomercio!: Subcomercio;
  @Input() comercio!: Comercio;

  userData: Usuario = {
    nombre_fantasia: '',
    email: '',
    id_token: '',
    usuario_id: 0,
    rol_id: 0,
    comercio_id: 0,
    rut_comercio: '',
  };

  successfulUpdate = false;
  loadingUpdate = false;
  mensajeResultado = '';
  private _montoComercioCheckbox: boolean = false;
  public get montoComercioCheckbox(): boolean {
    return this._montoComercioCheckbox;
  }
  public set montoComercioCheckbox(v: boolean) {
    this._montoComercioCheckbox = v;
    this.montoInput = this.comercio.montoMinimo.toString();
  }

  montoInput = '';
  get isInputInvalid(): boolean {
    if (this.montoInput && !/^\d+$/.test(this.montoInput)) {
      return true; // Input is not a valid integer
    }
    let numericVal = parseInt(this.montoInput);
    return numericVal < 0;
  }

  get guardarDisabled(): boolean {
    return (
      this.isInputInvalid ||
      this.loadingUpdate ||
      parseInt(this.montoInput) === this.subcomercio.montoMinimo
    );
  }

  closeModal() {
    console.log('emit closeModalEvent');
    this.closeModalEvent.emit();
  }

  async onClickGuardar() {
    if (this.isInputInvalid) {
      console.log('form is not valid!', this.montoInput);
      return;
    }
    this.loadingUpdate = true;
    this.successfulUpdate = false;
    let params: ParametroPutSubcomercios = {
      rol_id: this.userData.rol_id,
      usuario_id: this.userData.usuario_id,
      subcomercio_ids: [this.subcomercio.id],
      montos_minimos: [parseInt(this.montoInput)],
    };

    console.log('actualizando montos minimos...', params);
    let response = await this.subcomerciosService.updateSubcomercios(params);
    this.mensajeResultado = response.message;
    if (response.status === 'OK') {
      this.successfulUpdate = true;
      this.subcomercio.montoMinimo = parseInt(this.montoInput);
    }
    this.loadingUpdate = false;
  }

  formatearMonto(monto: number) {
    let result = formatearMonto(monto.toString());
    console.log(result);
    return result;
  }
}
