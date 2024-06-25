//librerias
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Indicador, ParametroGetIndicadores } from 'src/models/Indicador';
// import Viewer from 'viewerjs';

//servicios
import { ContracargosService } from '../../services/contracargos.service';
import { IndicadoresService } from '../../services/indicadores.service';

//modelos
import { EstadosNotificadoComercio } from 'src/app/constants';
import { VariablesGlobalesService } from 'src/app/modules/comunes/services/variables-globales.service';
import { Usuario } from 'src/models/Usuario';
import { ObjArchivoRechazado } from 'src/models/comunes/ArchivoAdjuntoRechazado';
import { ContracargoComercio } from 'src/models/contracargos/Contracargo';
import {
  GetContracargoComercio,
  RespuestaContracargosComercio,
  getDefaultRespuestaContracargos,
} from 'src/models/contracargos/GetContracargo';
import { FilterSelection, FiltroCbkConfig } from 'src/models/filtros/Filtro';
import { ESTADOS, ETAPAS, MARCAS, etapaMap, marcaMap } from './filter_data';
import {
  SortChangedEvent,
  SortIconDirective,
} from 'src/app/modules/comunes/directives/sort-icon.directive';
import { Router } from '@angular/router';

enum BotonEstadosContracargo {
  Todos = 1,
  Debitar = 2,
  Abonar = 3,
  Cerrar = 4,
  Representar = 5,
  Gestionar = 6,
}

interface BotonFiltro {
  visibleText: string;
  buttonNumber: number;
  count: number | undefined;
  loading: boolean;
}

@Component({
  selector: 'app-contracargos',
  templateUrl: './contracargos.component.html',
  styleUrls: ['./contracargos.component.css'],
})
export class ContracargosComponent implements OnInit {
  constructor(
    private contracargosService: ContracargosService,
    private indicadoresService: IndicadoresService,
    private dataStorageService: VariablesGlobalesService,
    private router: Router
  ) { }

  @ViewChildren(SortIconDirective)
  sortableDirectives!: QueryList<SortIconDirective>;
  botonEstadosEnum = BotonEstadosContracargo;

  // TODO: buscar dias maximo etapa?
  readonly MAX_DIAS_PARA_CIERRE = 40;

  // Los estados validos para saber que el caso tiene un estado que requiere habilitar el o los botones de gestion.
  //   readonly ESTADOS_GESTIONAR = ESTADOS_GESTIONAR;
  readonly ESTADOS_GESTIONAR = EstadosNotificadoComercio;


  detailsIndex: number | null = null;

  toggleDetails(index: number) {
    this.detailsIndex = this.detailsIndex === index ? null : index;
  }


  estadosMenuButtons: BotonFiltro[] = [
    {
      visibleText: 'Gestionar',
      buttonNumber: this.botonEstadosEnum.Gestionar,
      count: undefined,
      loading: false,
    },
    {
      visibleText: 'Todos',
      buttonNumber: this.botonEstadosEnum.Todos,
      count: undefined,
      loading: false,
    },
  ];

  readonly botonEstadoMap: { [key: number]: number[] } = {
    [this.botonEstadosEnum.Todos]: [],
    [this.botonEstadosEnum.Gestionar]: this.ESTADOS_GESTIONAR,
  };

  async ngOnInit(): Promise<void> {
    console.log('on init contracargos...');
    let currentPath = this.router.url;
    console.log('Current Path:', currentPath);
    try {
      let { status, usuario } = this.dataStorageService.getUsuarioStorage();
      if (status) {
        this.userData = usuario;
      }
      this.objGetContracargo.rut_comercio = this.userData.rut_comercio;

      await Promise.all([
        this.cargarIndicadores(),
        this.traerContracargos(),
        this.getQuickFiltersCount(),
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getQuickfilterCount(btnEnumVal: number) {
    let idx = this.estadosMenuButtons.findIndex(
      (ele) => ele.buttonNumber === btnEnumVal
    );
    this.estadosMenuButtons[idx].count = undefined;
    this.estadosMenuButtons[idx].loading = true;
    let params: GetContracargoComercio = {
      ...this.objGetContracargo,
      estados: this.botonEstadoMap[btnEnumVal],
      etapas: [],
      marcas: [],
      page_size: 1,
    };

    let resp = await this.contracargosService.getContracargos(params);
    console.log('resp quickfilter', btnEnumVal, resp);
    this.estadosMenuButtons[idx].count = resp.total;

    this.estadosMenuButtons[idx].loading = false;
  }

  async getQuickFiltersCount() {
    await Promise.all(
      this.estadosMenuButtons.map((ele) =>
        this.getQuickfilterCount(ele.buttonNumber)
      )
    );
  }

  async cargarIndicadores() {
    let paramGetIndicadores: ParametroGetIndicadores = {
      comercio_id: this.userData.comercio_id,
    };
    let resp = await this.indicadoresService.getIndicadores(
      paramGetIndicadores
    );
    if (resp.status === 'OK') {
      this.indicadores = resp.indicadores;
    }
  }

  onSearch(searchValue: string) {
    // pequenio hack para que la busqueda funcione incluso si
    // se copia y pega el caso que aparece en la tabla
    // [V|M]2390798519 -> 2390798519
    let finalVal = searchValue;
    if (
      searchValue.length > 1 &&
      ['m', 'v'].includes(searchValue.toLowerCase().charAt(0))
    ) {
      finalVal = searchValue.substring(1);
    }
    this.paginaActual = 1;
    this.objGetContracargo = {
      ...this.objGetContracargo,
      // TODO: ver nombre final de este param
      busqueda_avanzada: finalVal,
    };
  }

  public set objGetContracargo(v: GetContracargoComercio) {
    this._objGetContracargo = { ...v };
    console.log('actalizando objGetContracargo');
    this.actualizarContracargos();
  }

  public get objGetContracargo(): GetContracargoComercio {
    return this._objGetContracargo;
  }

  userData: Usuario = {
    nombre_fantasia: '',
    email: '',
    id_token: '',
    usuario_id: 0,
    rol_id: 0,
    comercio_id: 0,
    rut_comercio: '',
  };
  loadingPorGestionarCount = false;
  isFirstLoad = true;

  initialSelection: FilterSelection = {
    marcas: [],
    estados: [],
    etapas: [],
  };

  _objGetContracargo: GetContracargoComercio = {
    ...this.initialSelection,
    estados: this.ESTADOS_GESTIONAR,
    fecha_desde: '',
    fecha_hasta: '',
    page: 1,
    rut_comercio: '',
    page_size: 10,
    busqueda_avanzada: '',
  };

  selectedFiles: File[] = []; // Guardamos los archivos cargados en caso de rechazar el caso.
  rechacedFiles: ObjArchivoRechazado[] = []; // Guardamos los archivos que por peso u otra razon se rechazaron.
  cambioEstado: boolean = false; //
  mensajeSatisfactorio: string = '';
  optionRadio: string = ''; //input radio
  indicadores: Indicador[] = []; // array de indicadores

  loadingTablaContracargos = false;
  objResContracargos: RespuestaContracargosComercio =
    getDefaultRespuestaContracargos();

  contracargos: ContracargoComercio[] = []; // Lista de todos los contracargos
  casoSeleccionado: ContracargoComercio = {
    // Guardamos el contracargo seleccionado en la tabla.
    caso: 0,
    marcaId: 0,
    nombreMarca: '',
    motivoDesc: '',
    motivoId: '',
    etapaId: 0,
    etapaDesc: '',
    estado: '',
    estadoId: 0,
    recepcion: '',
    diasParaCierre: 0,
    montoCbk: '',
    montoTrx: '',
    idMarca: '',
    nombreComercio: '',
  };

  filtrosConfig: FiltroCbkConfig = {
    marcas: MARCAS,
    etapas: ETAPAS,
    estados: ESTADOS,
    marcaMap: marcaMap,
    etapaMap: etapaMap,
  };

  actualizarFiltrosMarcaEstado(idsSeleccionados: FilterSelection) {
    this.objGetContracargo.marcas = idsSeleccionados.marcas;
    this.objGetContracargo.etapas = idsSeleccionados.etapas;
    this.objGetContracargo.estados = idsSeleccionados.estados;
    this.paginaActual = 1;
    this.botonEstadoSeleccionado = 1;
    this.actualizarContracargos(); //llamamos funcion para que se actualicen los datos de la tabla
  }

  // PAGINACION
  registrosPorPagina = 10;
  totalRegistrosPagination = 0; // cuando se traen los contracargos se actualiza este dato
  paginaActual = 1;
  maxPaginasMostradas = 5;

  get totalPaginas(): number {
    return Math.ceil(this.totalRegistrosPagination / this.registrosPorPagina);
  }

  get rangoInferior(): number {
    return this.registrosPorPagina * (this.paginaActual - 1) + 1;
  }

  get rangoSuperior(): number {
    return Math.min(
      this.registrosPorPagina * this.paginaActual,
      this.totalRegistrosPagination
    );
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarContracargos(); //llamamos funcion para que se actualicen los datos de la tabla
    }
  }

  // calcula dinámicamente los números de página que se mostrarán en la paginación, limitando el número de páginas a mostrar según la configuración de maxPaginasMostradas
  paginasArray(): number[] {
    const paginas = [];
    let inicio = Math.max(
      1,
      this.paginaActual - Math.floor(this.maxPaginasMostradas / 2)
    ); //Se calcula inicialmente para asegurarse de que la página actual tenga al menos la mitad del número máximo de páginas mostradas a su izquierda. Se utiliza Math.max para garantizar que no se muestren números de página menores que 1.
    const fin = Math.min(
      inicio + this.maxPaginasMostradas - 1,
      this.totalPaginas
    ); //Se calcula para definir el límite superior de las páginas a mostrar. Se asegura de que, al menos, se muestren maxPaginasMostradas páginas o menos si el total de páginas es menor que el máximo permitido.

    if (this.totalPaginas - fin < Math.floor(this.maxPaginasMostradas / 2)) {
      //Condición adicional para ajustar las páginas mostradas: Si el número de páginas restantes hasta el final es menor que la mitad de maxPaginasMostradas, se ajusta el inicio para mostrar las páginas finales.
      inicio = Math.max(1, fin - this.maxPaginasMostradas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      // Llena un array paginas con los números de página que se mostrarán en la paginación, desde inicio hasta fin.
      paginas.push(i);
    }

    return paginas;
  }

  mostrarAlert() {
    alert('Activado');
  }

  formatearMonto(monto: number | string) {
    let montoNumber: number;
    if (typeof monto === 'string') {
      montoNumber = parseInt(monto);
    } else {
      montoNumber = monto;
    }
    return montoNumber.toLocaleString('es-ES');
  }

  // Boton de filtro ESTADO seleccionado
  botonMenuSeleccionado: number = 1;
  seleccionarBotonMenu(numero: number): void {
    this.botonMenuSeleccionado = numero;
  }

  // Guardamos o limpiamos el caso seleccionado
  cambiarCasoSeleccionado(casoSelec: ContracargoComercio) {
    console.log('Actual caso seleccionado:', this.casoSeleccionado);
    this.casoSeleccionado = { ...casoSelec };
    console.log('Actualizado: ', this.casoSeleccionado);
  }

  // Limpiar el caso seleccionado
  limpiarCasoSeleccionado() {
    // Creamos un objeto de contracargo vacio

    let obj = {
      // Guardamos el contracargo seleccionado en la tabla.
      caso: 0,
      marcaId: 0,
      nombreMarca: '',
      motivoDesc: '',
      motivoId: '',
      etapaId: 0,
      etapaDesc: '',
      estado: '',
      estadoId: 0,
      recepcion: '',
      diasParaCierre: 0,
      montoCbk: '',
      montoTrx: '',
      idMarca: '',
      nombreComercio: '',
    };

    // Llamamos a la funcion para limpiar los campos del caso seleccionado
    this.cambiarCasoSeleccionado(obj);
  }

  // funcion para llamar a la api de contracargos cada vez que se cambia de pagina
  actualizarContracargos() {
    this.objGetContracargo.page = this.paginaActual;
    this.traerContracargos();
  }

  // Funcion reutilizable para actualizar los contracargos, cada vez que sea necesario
  async traerContracargos() {
    // Traemos los contracargos
    this.loadingTablaContracargos = true;
    this.objResContracargos = await this.contracargosService.getContracargos(
      this.objGetContracargo
    );
    this.contracargos = this.objResContracargos.contracargos;
    this.totalRegistrosPagination = this.objResContracargos.total ?? 0;
    this.loadingTablaContracargos = false;
  }

  // Lista desplegable 2
  listaDesplegable2: boolean = false;
  toggleDropdown2() {
    this.listaDesplegable2 = !this.listaDesplegable2;
  }

  // Lista desplegable 3
  listaDesplegable3: boolean = false;
  toggleDropdown3() {
    this.listaDesplegable3 = !this.listaDesplegable3;
  }

  // Manejo de Etapas de formulario
  etapaFormulario: number = 1;

  siguienteEtapa(etapa: number) {
    this.etapaFormulario = etapa;
  }

  anteriorEtapa() {
    if (this.etapaFormulario > 1) {
      this.etapaFormulario--;
    }
  }

  imageSrc = '/assets/Evidencia1.png';

  // Modal para visualizar documento y completar formulario
  mostrarModalDocYForm: boolean = false;
  changeModalDocYForm() {
    this.mostrarModalDocYForm = !this.mostrarModalDocYForm;
    this.etapaFormulario = 1; //si se abre o cierra la modal, siempre empieza por la etapa 1.
    this.selectedFiles = []; //se limpia todo
    this.optionRadio = '';
  }

  // Esta funcion se llamara en la funcion (changeModalGestionarCaso) que limpia todas las variables al abrir o cerrar la modal. Y tambien se llamara cuando se aprieta la opcion rechazar, pero despues cancela. Porque si ya cargo archivos, hay que limpiarlos
  limpiarArchivosSeleccionados() {
    this.selectedFiles = [];
    this.rechacedFiles = [];
  }

  // Mensaje de exito
  gestionCaso(mensaje: string) {
    this.cambioEstado = true;
    this.mensajeSatisfactorio = mensaje;
  }

  handleFileInput(_event: any) { }

  // Modal para gestionar el caso.
  mostrarModalGestionarCaso: boolean = false;
  changeModalGestionarCaso() {
    this.mostrarModalGestionarCaso = !this.mostrarModalGestionarCaso; // cambiamos el estado de la modal
    this.cambioEstado = false; // si se cierra o abre la modal, limpiamos estas variable.
    // Disable scrolling when modal is shown
    if (this.mostrarModalGestionarCaso) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    this.mensajeSatisfactorio = '';
    this.limpiarArchivosSeleccionados();
  }

  // Lista desplegable comercios
  listaDesplegable: boolean = false;
  toggleDropdown() {
    this.listaDesplegable = !this.listaDesplegable;
  }

  // Formato fecha tabla
  formatFecha(fecha: string) {
    // Divide la fecha en partes usando el separador "/"
    const partes = fecha.split('/');

    // Asegura que hay tres partes: día, mes y año
    if (partes.length === 3) {
      const dia = partes[0];
      const mes = partes[1];
      const año = partes[2];

      // Retorna la fecha en el nuevo formato "DD-MM-YYYY"
      return `${dia}-${mes}-${año}`;
    } else {
      // Retorna la fecha original si no está en el formato esperado
      return fecha;
    }
  }

  // Boton de filtro ESTADO seleccionado
  botonEstadoSeleccionado: number = this.botonEstadosEnum.Gestionar;
  seleccionarBotonEstado(numero: number): void {
    this.botonEstadoSeleccionado = numero;
    let estados = this.botonEstadoMap[numero];
    this.paginaActual = 1;
    this.objGetContracargo.estados = estados;
    this.objGetContracargo.etapas = [];
    this.objGetContracargo.marcas = [];
    // this.initialSelection = {...this.objGetContracargo}
    this.initialSelection = { estados: [], etapas: [], marcas: [] };
    this.actualizarContracargos();
  }

  // Boton de filtro FECHA seleccionado
  // TODO: traerContracargos con rango de fecha segun boton seleccionado
  botonFechaSeleccionado: number = 0;
  seleccionarBotonFiltroDias(numero: number, dias: number): void {
    let ultimosDias;
    if (this.botonFechaSeleccionado === numero) {
      this.botonFechaSeleccionado = 0;
    } else {
      this.botonFechaSeleccionado = numero;
      ultimosDias = dias;
    }
    this.paginaActual = 1;
    this.objGetContracargo.ultimos_dias = ultimosDias;
    this.actualizarContracargos();
  }

  seleccionarBotonFiltro(numero: number) { }

  obtenerNombreBotonOperaciones(idEstado: number) {
    // Función para determinar el nombre del botón
    if (this.ESTADOS_GESTIONAR.includes(idEstado)) {
      return 'Gestionar';
    } else {
      return 'Ver';
    }
  }

  onModalClose() {
    console.log('closing modal from parent');
    this.traerContracargos();
    this.limpiarCasoSeleccionado();
    this.changeModalGestionarCaso();
    this.getQuickFiltersCount();
  }

  handleSort(event: SortChangedEvent) {
    const { id: columnId, sortDirection: order } = event;
    let sortParam = '';
    let orderParam = '';
    if (order) {
      sortParam = columnId;
      orderParam = order;
    }
    this.objGetContracargo.sort = sortParam;
    this.objGetContracargo.order = orderParam;

    this.paginaActual = 1;
    this.traerContracargos();

    // Reset all SortIconDirectives except the one with matching id
    this.sortableDirectives.forEach((directive) => {
      if (directive.id !== columnId) {
        directive.reset();
      }
    });
  }
}
