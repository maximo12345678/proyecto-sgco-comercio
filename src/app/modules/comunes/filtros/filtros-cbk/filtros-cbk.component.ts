import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FilterSelection,
  FiltroCbkConfig,
  FiltroEstado,
  FiltroEtapa,
  FiltroMarca,
} from 'src/models/filtros/Filtro';

enum FilterStage {
  initial,
  brandSelection,
  stageSelection,
  statusSelection,
}

@Component({
  selector: 'app-filtros-cbk',
  templateUrl: './filtros-cbk.component.html',
  styleUrls: ['./filtros-cbk.component.css'],
})
export class FiltrosCbkComponent implements OnInit {
  @Input() initialSelection!: FilterSelection;
  @Input() filtrosConfig!: FiltroCbkConfig;
  @Input() isResponsive = false;
  @Output() onSelectionChange: EventEmitter<FilterSelection> =
    new EventEmitter<FilterSelection>();
  constructor() {}

  ngOnInit(): void {
    const { estados, etapas, marcas, marcaMap, etapaMap } = this.filtrosConfig;
    this.marcasValues = marcas;
    this.estadosValues = estados;
    this.etapasValues = etapas;
    this.etapaMap = etapaMap;
    this.marcaMap = marcaMap;
    this.selections = this.initialSelection;
    console.log('got initial selection!', this.selections);
    this.updateDisplayedSelections();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['initialSelection']) {
      return;
    }
    const previousValue = changes['initialSelection'].previousValue;
    if (!previousValue) {
      return;
    }
    console.log('Initial Selection changed:', changes);
    const currentValue = changes['initialSelection'].currentValue;
    this.selections = currentValue;
    this.updateDisplayedSelections();
  }

  updateDisplayedSelections() {
    this.marcasValues.forEach((element) => {
      if (this.selections.marcas.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.etapasValues.forEach((element) => {
      if (this.selections.etapas.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });

    this.estadosValues.forEach((element) => {
      if (this.selections.estados.includes(element.id)) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
  }

  get selectAllMarcas(): boolean {
    return this.marcasValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllMarcas(value: boolean) {
    this.marcasValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedMarcas(): number {
    return this.marcasValues.filter((ele) => ele.selected).length;
  }

  get selectAllEtapas(): boolean {
    return this.etapasValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllEtapas(value: boolean) {
    this.etapasValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedEtapas(): number {
    return this.etapasValues.filter((ele) => ele.selected).length;
  }

  get selectAllEstados(): boolean {
    return this.estadosValues.findIndex((ele) => !ele.selected) === -1;
  }

  set selectAllEstados(value: boolean) {
    this.estadosValues.forEach((element) => (element.selected = value));
    this.updateSelections();
  }

  get numSelectedEstados(): number {
    return this.estadosValues.filter((ele) => ele.selected).length;
  }


  updateSelections() {
    console.log('update selections!');
    switch (this.currentStage) {
      case this.stages.brandSelection:
        console.log('cambio la seleccion de marcas');
        this.selections.marcas = this.marcasValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;
      case this.stages.stageSelection:
        console.log('cambio la seleccion de etapas');
        this.selections.etapas = this.etapasValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;

      case this.stages.statusSelection:
        console.log('cambio la seleccion de estados');
        this.selections.estados = this.estadosValues
          .filter((element) => element.selected)
          .map((v) => v.id);
        break;

      default:
        break;
    }
    if (!this.isResponsive || !this.mostrarModalFiltros){
        this.filterSelectionChanged();
    }
  }

  marcasValues: FiltroMarca[] = [];
  etapasValues: FiltroEtapa[] = [];
  estadosValues: FiltroEstado[] = [];
  marcaMap: { [id: number]: string } = {};
  etapaMap: { [id: number]: string } = {};

  stages = FilterStage;
  currentStage = this.stages.initial;
  mostrarModalFiltros = false;
  selections: FilterSelection = {
    marcas: [],
    etapas: [],
    estados: [],
  };

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.mostrarModalFiltros) return;
    const clickedElement = event.target as HTMLElement;

    if (!clickedElement) return;
    const isClickedInsideContainer =
      !!clickedElement.closest('.container-filtros');
    const isClickedOnFilterButton =
      clickedElement.classList.contains('filter-button');

    console.log(clickedElement);
    console.log('inside container?', isClickedInsideContainer);
    console.log('on button ?', isClickedOnFilterButton);

    if (!isClickedInsideContainer && !isClickedOnFilterButton) {
      this.hideFilters();
    }
  }

  hideFilters() {
    console.log('closing filters from hide function');
    this.mostrarModalFiltros = false;
    document.body.style.overflow = '';
  }

  toggleFilterPopup() {
    if (this.mostrarModalFiltros) {
      console.log('closing filters...');
      document.body.style.overflow = '';
    } else {
      console.log('opening filters...');
      if (this.isResponsive) {
        document.body.style.overflow = 'hidden';
      }
    }
    this.mostrarModalFiltros = !this.mostrarModalFiltros;
  }

  filterSelectionChanged() {
    console.log('filtro cambio!', this.selections);
    this.onSelectionChange.emit(this.selections);
  }

  changeFilterStage(stage: FilterStage) {
    this.currentStage = stage;
  }

  clearSelections() {
    this.marcasValues.forEach((element) => (element.selected = false));
    this.selections.marcas = [];
    this.etapasValues.forEach((element) => (element.selected = false));
    this.selections.etapas = [];
    this.estadosValues.forEach((element) => (element.selected = false));
    this.selections.estados = [];
    this.updateSelections();
  }

  get numOffilteredCategories() {
    return (
      Number(this.numSelectedMarcas > 0) +
      Number(this.numSelectedEtapas > 0) +
      Number(this.numSelectedEstados > 0)
    );
  }

  applySelection(){
    this.onSelectionChange.emit(this.selections);
    this.hideFilters();
  }
}
