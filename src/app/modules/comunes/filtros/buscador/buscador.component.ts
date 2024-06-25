import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
})
export class BuscadorComponent implements OnInit {
  constructor() {}

  private readonly debounceTimeMs = 500;
  @Output() onSearchChange = new EventEmitter<string>();
  @Input() placeholder: string = 'Buscar';

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
      .subscribe((searchValue) => {
        this.onSearchChange.emit(searchValue);
      });
  }

  private searchSubject = new Subject<string>();
  inputBuscador = '';

  onSearch() {
    this.searchSubject.next(this.inputBuscador);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
