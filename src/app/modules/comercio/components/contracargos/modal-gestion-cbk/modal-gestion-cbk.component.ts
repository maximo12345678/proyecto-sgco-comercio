import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EstadosNotificadoComercio } from 'src/app/constants';
import { HistorialContracargoService } from 'src/app/modules/comercio/services/historial-contracargo.service';
import { VariablesGlobalesService } from 'src/app/modules/comunes/services/variables-globales.service';
import { Usuario } from 'src/models/Usuario';
import { ContracargoComercio } from 'src/models/contracargos/Contracargo';
import { GetHistorialContracargo } from 'src/models/contracargos/GetHistorialContracargo';
import { HistorialContracargo } from 'src/models/contracargos/HistorialContracargo';

enum VistasModal {
  Default = 'default',
  Aceptar = 'aceptar',
  Rechazar = 'rechazar',
}

@Component({
  selector: 'app-modal-gestion-cbk',
  templateUrl: './modal-gestion-cbk.component.html',
  styleUrls: ['./modal-gestion-cbk.component.css'],
})
export class ModalGestionCbkComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() contracargo!: ContracargoComercio;

  constructor(
    private historialService: HistorialContracargoService,
    private dataStorageService: VariablesGlobalesService
  ) { }

  mensajeSatisfactorio: string = ''; // La usamos de bandera para saber cuando se aprieta el boton de aceptar o rechazar el caso
  cambioEstado: boolean = false;

  loadingHistorial = false;
  loadingCambioEstado = false;
  historialCaso: HistorialContracargo[] = [];

  VistasDisponibles = VistasModal;
  vistaActual: VistasModal = this.VistasDisponibles.Default;

  userData: Usuario = {
    nombre_fantasia: '',
    email: '',
    id_token: '',
    usuario_id: 0,
    rol_id: 0,
    comercio_id: 0,
    rut_comercio: '',
  };

  get cbkPorGestionar(): boolean {
    // return this.contracargo.estadoId === ESTADO_NOTIFICADO ;
    // return ESTADOS_GESTIONAR.includes(this.contracargo.estadoId);
    return EstadosNotificadoComercio.includes(this.contracargo.estadoId);
  }

  ngOnInit(): void {
    let { status, usuario } = this.dataStorageService.getUsuarioStorage();
    if (status) {
      this.userData = usuario;
    }
    this.cargarHistorial();
  }

  async cargarHistorial() {
    console.log('cargando historial!');
    this.loadingHistorial = true;
    let paramsHistorial: GetHistorialContracargo = {
      contracargo_id: this.contracargo.caso.toString(),
      usuario_id: this.userData.usuario_id,
      rol_id: this.userData.rol_id,
    };
    let response = await this.historialService.getHistorial(paramsHistorial);
    if (response.status === 'OK') {
      //TODO: omitir sort cuando venga ordenada de db
      response.historial.sort((a, b) => {
        const dateA = new Date(a.fechaContracargo);
        const dateB = new Date(b.fechaContracargo);
        return dateB.getTime() - dateA.getTime();
      });
    }
    this.historialCaso = response.historial;
    this.loadingHistorial = false;
  }

  onGestionCancel() {
    this.vistaActual = VistasModal.Default;
  }

  // Activamos esto cuando se quiera rechazar o aceptar el caso
  cambiarRechazarOAceptarCaso(vistaElegida: VistasModal) {
    this.vistaActual = vistaElegida;
  }

  // Mensaje de exito
  gestionCaso(mensaje: string) {
    this.cambioEstado = true;
    this.mensajeSatisfactorio = mensaje;
  }

  closeModal() {
    console.log('emit closeModalEvent');
    this.closeModalEvent.emit();
  }

  formatearMonto(monto: string) {
    let convertido = parseInt(monto, 10);
    return convertido.toLocaleString('es-ES');
  }

  formatearFecha(fechaParam: string) {
    const [anio, mes, dia] = fechaParam.split('-');
    const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia)); // Restamos 1 al mes porque es basado en cero

    const diaFormateado = fecha.getDate().toString().padStart(2, '0');
    const mesFormateado = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Sumamos uno al mes
    const anioFormateado = fecha.getFullYear();

    return `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
  }


  // Formato fecha tabla
  formatFechaGuion(fecha: string) {
    // Divide la fecha en partes usando el separador de espacio
    const [fechaPart, tiempoPart] = fecha.split(' ');

    // Divide la parte de la fecha en partes usando el separador "-"
    const [año, mes, dia] = fechaPart.split('-');

    // Retorna la fecha en el nuevo formato "DD-MM-YYYY"
    return `${dia}-${mes}-${año}`;
  }


}
