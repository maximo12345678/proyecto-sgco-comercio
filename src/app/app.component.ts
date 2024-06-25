import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariablesGlobalesService } from './modules/comunes/services/variables-globales.service';

@Component({
  selector: 'mcf-bts-contra-cargo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private variablesGlobalesService: VariablesGlobalesService
  ) {}

  awaitingLogin = true;

  async ngOnInit(): Promise<void> {
    await this.variablesGlobalesService.init();
    this.awaitingLogin = false;
    console.log("app component init")
    let currentPath = this.router.url;
    console.log('Current Path:', currentPath);
    console.log("Prueba css")
  }
}
