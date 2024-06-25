import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { ContracargosComponent } from './modules/comercio/components/contracargos/contracargos.component';
import { ConfiguracionesComponent } from './modules/comercio/components/configuraciones/configuraciones.component';

const routes: Routes = [
  {
    path: 'mcf-bst-contra-cargo',
    children: [
      { path: '', redirectTo: 'contracargos', pathMatch: 'full' },
      { path: 'contracargos', component: ContracargosComponent },
      { path: 'configuraciones', component: ConfiguracionesComponent },
    ],
  },
  { path: '**', component: ContracargosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule {}
