import { Component, Input } from '@angular/core';
import { formatearMonto } from 'src/app/utils';
import { Indicador } from 'src/models/Indicador';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css'],
})
export class IndicadoresComponent {
  @Input() indicador!: Indicador; // el operador '!' para indicar que estará definida

  constructor() {}

  convertirPrimerCaracterMayuscula(texto: string) {
    // Convertir todo el texto a minúsculas
    texto = texto.toLowerCase();
    // Convertir el primer carácter a mayúscula
    texto = texto.charAt(0).toUpperCase() + texto.slice(1);
    return texto;
  }

  formatearMonto(monto:string){
    return formatearMonto(monto)
  }



  normalizarNameIndicador(name: string) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

}
