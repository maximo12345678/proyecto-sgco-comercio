import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { fromEvent, throttleTime } from 'rxjs';

export interface SortChangedEvent {
  id: string;
  sortDirection: string;
}

@Directive({
  selector: '[appSortIcon]',
})
export class SortIconDirective implements OnChanges {
  @Input() id!: string;
  @Output() sortChanged: EventEmitter<{ id: string; sortDirection: string }> =
    new EventEmitter();
  disabled = false;

  private sortClasses: string[] = ['fa-sort', 'fa-sort-up', 'fa-sort-down'];
  private sortDirections: string[] = ['', 'ASC', 'DESC'];
  private currentClassIndex: number = 0;
  private readonly THROTTLE_TIME_MS = 700;
  private readonly disabledColor = '#b5b5b5';
  private readonly iconHeight = 12;
  private fillColor = 'white';

  constructor(private el: ElementRef) {
    this.el.nativeElement.innerHTML = this.svgSource;
    fromEvent(this.el.nativeElement, 'click')
      .pipe(throttleTime(this.THROTTLE_TIME_MS))
      .subscribe(() => this.onClick());
  }

  ngOnChanges(): void {
    this.disabled = !this.id;
    if (this.disabled) {
      this.fillColor = this.disabledColor;
      this.el.nativeElement.classList.add('svgfas', 'disabled');
      this.el.nativeElement.innerHTML = this.svgSource;
    } else {
      this.fillColor = 'white';
      this.el.nativeElement.classList.remove('svgfas', 'disabled');
    }
  }

  onClick() {
    if (this.disabled) return;
    console.log('clicked icon ', this.id);
    this.currentClassIndex =
      (this.currentClassIndex + 1) % this.sortClasses.length;
    this.el.nativeElement.innerHTML = this.svgSource;
    const sortDirection = this.sortDirections[this.currentClassIndex];
    this.sortChanged.emit({ id: this.id, sortDirection });
  }

  reset() {
    if (this.disabled) return;
    this.currentClassIndex = 0;
    this.el.nativeElement.innerHTML = this.svgSource;
  }

  get svgSource() {
    if (this.currentClassIndex === 0) {
      // 'fa-sort'
      return `
        <svg xmlns="http://www.w3.org/2000/svg" height="${this.iconHeight}" viewBox="0 0 320 512">
            <path fill="${this.fillColor}" d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/>
        </svg>
        `;
    } else if (this.currentClassIndex === 1) {
      //  'fa-sort-up'
      return `
        <svg xmlns="http://www.w3.org/2000/svg" height="${this.iconHeight}"  viewBox="0 0 320 512">
            <path fill="${this.fillColor}" d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/>
        </svg>
        `;
    } else {
      // 'fa-sort-down'
      return `
        <svg xmlns="http://www.w3.org/2000/svg" height="${this.iconHeight}" viewBox="0 0 320 512">
            <path fill="${this.fillColor}" d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/>
        </svg>
        `;
    }
  }
}
