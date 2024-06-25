import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { getDefaultComercio } from 'src/models/comercio/Comercio';
import {
    ParametroGetSubcomercios,
    Subcomercio,
} from 'src/models/comercio/GetSubcomercios';
import { SubcomerciosService } from '../../services/subcomercios.service';
import { ParametroPutSubcomercios } from 'src/models/comercio/PutSubcomercios';
import { formatearMonto } from 'src/app/utils';
import { VariablesGlobalesService } from 'src/app/modules/comunes/services/variables-globales.service';
import { SortChangedEvent, SortIconDirective } from 'src/app/modules/comunes/directives/sort-icon.directive';
import { Router } from '@angular/router';

interface SubcomercioCheck extends Subcomercio {
    selected: boolean;
}

@Component({
    selector: 'app-configuraciones',
    templateUrl: './configuraciones.component.html',
    styleUrls: ['./configuraciones.component.css'],
})
export class ConfiguracionesComponent implements OnInit {
    constructor(
        private subcomerciosService: SubcomerciosService,
        private dataStorageService: VariablesGlobalesService,
        private router: Router
    ) { }

    @ViewChildren(SortIconDirective)
    sortableDirectives!: QueryList<SortIconDirective>;

    montoInput = '';
    comercio_id = 0;
    mostrarModalFiltros = false;

    loadingSubcomercios = false;
    mensajeRespuestaSubcomercios: string = '';
    registrosPorPagina = 10;
    paramsGetSubcomercios: ParametroGetSubcomercios = {
        comercio_id: 0,
        page: 1,
        size: this.registrosPorPagina,
        busqueda_avanzada: ''
    };
    comercio = getDefaultComercio();
    //   subcomercioSeleccionado: Subcomercio[] = [];

    subcomerciosCheck: SubcomercioCheck[] = [];
    subcomercioSeleccionado: Subcomercio = {
        codigoLocal: '',
        comercioId: 0,
        id: 0,
        montoMinimo: 0,
        nombreFantasiaLocal: '',
    };

    private _montoComercioCheckbox: boolean = false;
    public get montoComercioCheckbox(): boolean {
        return this._montoComercioCheckbox;
    }
    public set montoComercioCheckbox(v: boolean) {
        this._montoComercioCheckbox = v;
        if (v) {
            this.montoInput = this.comercio.montoMinimo.toString();
        }
    }

    showToast = false;
    mensajeResultadoPutMasivo = '';
    putMasivoOk = false;

    resetToastVars() {
        this.showToast = false;
        this.mensajeResultadoPutMasivo = '';
        this.putMasivoOk = false;
    }

    private _mostrarModalGestionar: boolean = false;
    public get mostrarModalGestionar(): boolean {
        return this._mostrarModalGestionar;
    }
    public set mostrarModalGestionar(v: boolean) {
        this._mostrarModalGestionar = v;
        if (this.mostrarModalGestionar) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    get selectedCount(): number {
        return this.subcomerciosCheck.filter((ele) => ele.selected).length;
    }

    get allSelected(): boolean {
        return !this.subcomerciosCheck.find((ele) => !ele.selected);
    }

    set allSelected(v: boolean) {
        this.subcomerciosCheck.forEach((ele) => (ele.selected = v));
    }

    get noneSelected() {
        return !this.subcomerciosCheck.find((ele) => ele.selected);
    }

    private _subcomercios: Subcomercio[] = [];

    public get subcomercios(): Subcomercio[] {
        return this._subcomercios;
    }
    public set subcomercios(v: Subcomercio[]) {
        this._subcomercios = v;
        this.subcomerciosCheck = this._subcomercios.map((ele) => {
            return { ...ele, selected: false };
        });
    }
    get isInputInvalid(): boolean {
        if (this.montoInput && !/^\d+$/.test(this.montoInput)) {
            return true; // Input is not a valid integer
        }
        let numericVal = parseInt(this.montoInput);
        return numericVal < 0;
    }

    // PAGINACION
    totalRegistrosPorGestionar: number | undefined;
    totalRegistrosFiltrados = 0;
    totalRegistrosPagination = 0;
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

    mostrarModalConfirmacion: boolean = false;
    modalParam1: string = 'GUARDAR CAMBIOS';
    get modalParam2(): string {
        return `¿Desea aplicar esta configuracion de monto mínimo para los ${this.selectedCount} subcomercios seleccionados?`;
    }

    openModalEntera() {
        this.mostrarModalConfirmacion = true;
    }

    closeModalEntera() {
        this.mostrarModalConfirmacion = false;
    }

    async actualizarMontosMinimos() {
        this.loadingSubcomercios = true;
        let scs = this.subcomerciosCheck.filter((e) => e.selected).map((s) => s.id);
        let params: ParametroPutSubcomercios = {
            subcomercio_ids: scs,
            montos_minimos: scs.map((_) => parseInt(this.montoInput)),
        };

        console.log('actualizando montos minimos...', params);
        let response = await this.subcomerciosService.updateSubcomercios(params);
        this.mensajeResultadoPutMasivo = response.message;
        this.putMasivoOk = true;
        this.showToast = true;

        this.loadingSubcomercios = false;
    }

    async actualizarConfigSubcomercios() {
        this.closeModalEntera();
        await this.actualizarMontosMinimos();
        this.montoInput = '';
        this.montoComercioCheckbox = false;
        this.traerSubcomercios();
    }

    async traerSubcomercios() {
        this.loadingSubcomercios = true;
        let response = await this.subcomerciosService.getSubcomercios(
            this.paramsGetSubcomercios
        );
        if (response.status === 'OK') {
            this.subcomercios = response.subcomercios;
            this.totalRegistrosPagination = response.totalElements;
            this.comercio = response.comercio;
        } else {
            this.subcomercios = [];
            this.mensajeRespuestaSubcomercios = response.message;
        }
        this.loadingSubcomercios = false;
    }

    actualizarSubcomercios() {
        this.paramsGetSubcomercios.page = this.paginaActual;
        this.traerSubcomercios();
    }

    cambiarPagina(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaActual = pagina;
            this.actualizarSubcomercios(); //llamamos funcion para que se actualicen los datos de la tabla
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

    openFiltros() {
        this.mostrarModalFiltros = !this.mostrarModalFiltros;
    }

    onSearch(searchValue: string) {
        this.paramsGetSubcomercios.busqueda_avanzada = searchValue;
        this.paginaActual = 1;
        this.actualizarSubcomercios();
    }

    get botonAplicarDeshabilitado() {
        return this.noneSelected || !this.montoInput || this.isInputInvalid;
    }

    formatearMonto(monto: number) {
        return formatearMonto(monto.toString());
    }

    openModalGestionarSubcomercio(subcomercio: Subcomercio) {
        this.subcomercioSeleccionado = subcomercio;
        this.mostrarModalGestionar = true;
    }

    onModalClose() {
        this.mostrarModalGestionar = false;
        this.montoInput = '';
        this.montoComercioCheckbox = false;
        this.traerSubcomercios();
    }

    ngOnInit(): void {
        let { usuario } = this.dataStorageService.getUsuarioStorage();
        console.log('on init configuraciones...');
        let currentPath = this.router.url;
        console.log('Current Path:', currentPath);
        this.comercio_id = usuario.comercio_id;
        this.paramsGetSubcomercios.comercio_id = usuario.comercio_id;
        this.paramsGetSubcomercios.usuario_id = usuario.usuario_id;
        this.paramsGetSubcomercios.rol_id = usuario.rol_id;
        this.paramsGetSubcomercios.comercio_id = usuario.comercio_id;
        this.traerSubcomercios();
    }
    handleSort(event: SortChangedEvent) {
        const { id: columnId, sortDirection: order } = event;
        let sortParam = '';
        let orderParam = '';
        if (order) {
            sortParam = columnId;
            orderParam = order;
        }
        this.paramsGetSubcomercios.sort = sortParam;
        this.paramsGetSubcomercios.order = orderParam;

        this.paginaActual = 1;
        this.traerSubcomercios();

        // Reset all SortIconDirectives except the one with matching id
        this.sortableDirectives.forEach((directive) => {
            if (directive.id !== columnId) {
                directive.reset();
            }
        });
    }
}
