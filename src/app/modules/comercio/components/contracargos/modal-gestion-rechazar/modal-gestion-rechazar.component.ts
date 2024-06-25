import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EstadoStrResultadoRechazoCBKMap,
  TargetEtapaEvidenciaMap,
} from 'src/app/constants';
import { CambioEstadoService } from 'src/app/modules/comercio/services/cambio-estado.service';
import { VariablesGlobalesService } from 'src/app/modules/comunes/services/variables-globales.service';
import { extractFilenameAndType, readFileAsync } from 'src/app/utils';
import { CambioEstadoComercio } from 'src/models/CambioEstado';
import { ParametroPostEvidencia } from 'src/models/Evidencia';
import { ObjArchivoRechazado } from 'src/models/comunes/ArchivoAdjuntoRechazado';
import { ContracargoComercio } from 'src/models/contracargos/Contracargo';
import { CreateEvidenciaService } from '../../../services/carga-evidencia.service';

@Component({
  selector: 'app-modal-gestion-rechazar',
  templateUrl: './modal-gestion-rechazar.component.html',
  styleUrls: ['./modal-gestion-rechazar.component.css'],
})
export class ModalGestionRechazarComponent implements OnInit {
  @Output() cancelOperation = new EventEmitter<void>();
  @Output() closeWindow = new EventEmitter<void>();
  @Input() contracargo!: ContracargoComercio;

  constructor(
    private cambioEstadoService: CambioEstadoService,
    private createEvidenciaService: CreateEvidenciaService,
    private dataStorageService: VariablesGlobalesService
  ) {}
  ngOnInit(): void {
    this.paramsRechazar.id = this.contracargo.caso;
  }

  readonly limiteArchivos: number = 5; // Constante para saber el limite de archivos permitidos para adjuntar
  readonly limiteTamaño: number = 5242880; // Constante para saber el limite de tamaño de los archivos adjuntados
  readonly tiposPermitidos = [
    'application/pdf',
    'image/jpg',
    'image/jpeg',
    'image/png',
  ];
  readonly msjErrorTamaño: string =
    'Este documento es demasiado grande. Cargue solo archivos de menos de 5MB.';
  readonly msjErrorFormato: string =
    'Este documento es de un formato invalido. Cargue solo archivos PDF, JPG, JPEG o PNG.';
  readonly msjErrorLimiteArchivos: string =
    'El limite de archivos para adjuntar es de 5.';

  readonly msjRechazoExitoso: string = 'SE HA RECHAZADO EL CASO CON ÉXITO.';

  readonly msjRechazoErrorEvidencia: string =
    'El limite de archivos para adjuntar es de 5.';

  readonly msjRechazoErrorCambioEstado: string =
    'El limite de archivos para adjuntar es de 5.';

  selectedFiles: File[] = []; // Guardamos los archivos cargados en caso de rechazar el caso.
  rejectedFiles: ObjArchivoRechazado[] = []; // Guardamos los archivos que por peso u otra razon se rechazaron.
  inputObservacionesRechazo = '';
  loadingCambioEstado = false;
  cambioEstado = false;
  mensajeResultadoOperacion = '';
  operationFailed = false;
  confirmandoRechazo = false;
  paramsRechazar: CambioEstadoComercio = {
    id: 0,
  };

  limpiarArchivosSeleccionados() {
    this.selectedFiles = [];
    this.rejectedFiles = [];
  }

  cancelarGestion() {
    this.limpiarArchivosSeleccionados();
    this.cancelOperation.emit();
  }

  closeModal() {
    this.limpiarArchivosSeleccionados();
    this.closeWindow.emit();
  }

  solicitarConfirmacion() {
    this.confirmandoRechazo = true;
  }

  seguirEditando() {
    this.confirmandoRechazo = false;
  }

  // Cuando tenes el cursor sobre el cuadrado cuando estas arrastrando el archivo.
  onDragOver(event: Event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del navegador para el evento de arrastre.
    event.stopPropagation(); // Evita que el evento de arrastre se propague a elementos superiores en la jerarquía del DOM.
    const container = event.currentTarget as HTMLElement; // Se obtiene la referencia del html que llamo este evento.
    container.style.border = '2px dashed #dad9d9';
  }

  // Cuando sacas el cursor del cuadrado cuando estas arrastrando el archivo.
  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const container = event.currentTarget as HTMLElement;
    container.style.border = '2px dashed var(--color-variante-secundario)'; //volvemos al color original
  }

  // Cuando arrastra y suelta el archivo en el cuadro.
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.rejectedFiles = []; //limpiamos el array de los rechazados, para que se vea lindo

    const files: FileList | undefined = event.dataTransfer?.files; //capturamos el array de archivos cargados en memoria

    if (files) {
      //validamos que haya algo en la variable files

      for (let i = 0; i < files.length; i++) {
        //los agregamos al array de archivos

        if (
          files[i].size < this.limiteTamaño &&
          this.selectedFiles.length < this.limiteArchivos
        ) {
          //validamos si el tamaño del archivo es valido.
          this.selectedFiles.push(files[i]);
        } else if (files[i].size >= this.limiteTamaño) {
          this.rejectedFiles.push({
            fileData: files[i],
            msjError: this.msjErrorTamaño,
          }); //sino lo agregamos al array de los rechazados.
        } else {
          this.rejectedFiles.push({
            fileData: files[0],
            msjError: this.msjErrorLimiteArchivos,
          }); //va al array de los rechazados, por superar el tamaño.
        }
      }
    }

    const container = event.currentTarget as HTMLElement;
    container.style.border = '2px dashed var(--color-variante-secundario)';
  }

  // Cuando el archivo se carga manualmente
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.handleFileInput(event); //llamamos la funcion que agregara estos archivos al array de archivos.
  }

  // Funcion para agregar archivo/s del evento al array de archivos cargados.
  handleFileInput(event: any) {
    this.rejectedFiles = []; //limpiamos el array de los rechazados, para que se vea lindo

    const files: FileList = event.target.files;
    // Si los que ya hay cargados + los que se quieren cargar, son menos o igual al limite, se dejan subir.

    for (let i = 0; i < files.length; i++) {
      //los agregamos al array de archivos

      if (
        files[i].size < this.limiteTamaño &&
        this.selectedFiles.length < this.limiteArchivos
      ) {
        //validamos si el tamaño del archivo es valido.
        this.selectedFiles.push(files[i]);
      } else if (files[i].size >= this.limiteTamaño) {
        this.rejectedFiles.push({
          fileData: files[i],
          msjError: this.msjErrorTamaño,
        }); //sino lo agregamos al array de los rechazados.
      } else {
        this.rejectedFiles.push({
          fileData: files[0],
          msjError: this.msjErrorLimiteArchivos,
        }); //va al array de los rechazados, por superar el tamaño.
      }
    }
  }

  // Funcion para eliminar un archivo del array que venga como parametro (selected o rechaced)
  borrarArchivo(index: number, tipo: string) {
    if (tipo == 'selected') {
      this.selectedFiles.splice(index, 1);
    } else if (tipo == 'rechaced') {
      this.rejectedFiles.splice(index, 1);
    }
  }

  private async generateEvidenceParams(): Promise<ParametroPostEvidencia> {
    const postEvidenciaParams: ParametroPostEvidencia = {
      contracargo_id: this.contracargo.caso,
      etapa_id:
        TargetEtapaEvidenciaMap[this.contracargo.estadoId] ??
        this.contracargo.etapaId,
      files: [],
      observacion: this.inputObservacionesRechazo,
    };

    for (const file of this.selectedFiles) {
      if (!file) {
        console.log('No file?');
        continue;
      }
      const { name, file_type } = extractFilenameAndType(file);
      try {
        const fileData = await readFileAsync(file);
        postEvidenciaParams.files.push({ name, data: fileData, file_type });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
    return postEvidenciaParams;
  }

  async subirEvidenciaEnviarFormulario() {
    const postEvidenciaParams = await this.generateEvidenceParams();
    console.log('parametros evidencia', postEvidenciaParams);
    if (postEvidenciaParams.files.length === 0) {
      console.log('No se seleccionaron archivos de evidencia');
      this.mensajeResultadoOperacion =
        'NO SE SELECCIONARON ARCHIVOS DE EVIDENCIA VÁLIDOS.';
      return;
    }
    try {
      let response = await this.createEvidenciaService.createEvidence(
        postEvidenciaParams
      );
      console.log(response);
      if (response.status === 'OK') {
        return true;
      } else {
        this.mensajeResultadoOperacion = response.message.toUpperCase();
      }
    } catch (error) {
      console.error('Error:', error);
    }
    return false;
  }

  get puedeRechazar() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      return false;
    }
    return !this.rejectedFiles || this.rejectedFiles.length === 0;
  }

  async rechazarContracargo() {
    if (!this.puedeRechazar) {
      return;
    }
    this.confirmandoRechazo = false;
    this.cambioEstado = true;
    this.loadingCambioEstado = true;

    const evidenceUploaded = await this.subirEvidenciaEnviarFormulario();
    if (!evidenceUploaded) {
      this.loadingCambioEstado = false;
      this.operationFailed = true;
      return;
    }
    let result = await this.cambioEstadoService.rechazarContracargo(
      this.paramsRechazar
    );
    let message;
    if (result.status !== 'OK') {
      this.operationFailed = true;
      message = result.message ?? 'Ocurrio un error desconocido';
    } else {
      this.contracargo.estado =
        EstadoStrResultadoRechazoCBKMap[this.contracargo.estadoId] ??
        'Estado Desconocido';
      this.operationFailed = false;
      message = this.msjRechazoExitoso;
    }
    this.loadingCambioEstado = false;
    this.mensajeResultadoOperacion = message;
  }
}
