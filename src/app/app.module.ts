import {
    CommonModule,
    HashLocationStrategy,
    LocationStrategy,
} from '@angular/common';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomToastComponent } from './modules/comercio/components/comunes/custom-toast/custom-toast.component';
import { ModalConfirmacionComponent } from './modules/comercio/components/comunes/modal-confirmacion/modal-confirmacion.component';
import { ConfiguracionesComponent } from './modules/comercio/components/configuraciones/configuraciones.component';
import { ModalGestionConfigComponent } from './modules/comercio/components/configuraciones/modal-gestion-config/modal-gestion-config.component';
import { ContracargosComponent } from './modules/comercio/components/contracargos/contracargos.component';
import { ModalGestionAceptarComponent } from './modules/comercio/components/contracargos/modal-gestion-aceptar/modal-gestion-aceptar.component';
import { ModalGestionCbkComponent } from './modules/comercio/components/contracargos/modal-gestion-cbk/modal-gestion-cbk.component';
import { ModalGestionRechazarComponent } from './modules/comercio/components/contracargos/modal-gestion-rechazar/modal-gestion-rechazar.component';
import { HomeComponent } from './modules/comercio/components/home/home.component';
import { NavbarComponent } from './modules/comercio/components/navbar/navbar.component';
import { SortIconDirective } from './modules/comunes/directives/sort-icon.directive';
import { BuscadorComponent } from './modules/comunes/filtros/buscador/buscador.component';
import { FiltrosCbkComponent } from './modules/comunes/filtros/filtros-cbk/filtros-cbk.component';
import { IndicadoresComponent } from './modules/comunes/indicadores/indicadores.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContracargosComponent,
    IndicadoresComponent,
    NavbarComponent,
    ModalGestionCbkComponent,
    ModalGestionRechazarComponent,
    ModalGestionAceptarComponent,
    BuscadorComponent,
    ConfiguracionesComponent,
    ModalConfirmacionComponent,
    ModalGestionConfigComponent,
    CustomToastComponent,
    FiltrosCbkComponent,
    SortIconDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}