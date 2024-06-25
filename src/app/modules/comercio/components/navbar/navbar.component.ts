import { Component } from '@angular/core';
import { assetUrl } from 'src/single-spa/asset-url';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent {

  logoUrl: string = assetUrl('logo-klap.png')


  // Boton para activar menu en version responsive
  botonActiveMenu: boolean = false;
  cambiarBotonActiveMenu(): void {
    this.botonActiveMenu = !this.botonActiveMenu;
  }

  
  // Boton de filtro ESTADO seleccionado
  botonMenuSeleccionado: number = 1;
  seleccionarBotonMenu(numero: number): void {
    this.botonMenuSeleccionado = numero;
    this.botonActiveMenu = false;
  }

}
