import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PortalComponent } from "./portal.component";
import { WelcomeComponent } from "./welcome/welcome.component";

import { PalabrasReservadasComponent } from "./palabras-reservadas/palabras-reservadas.component";
import { ActualizarPalabrasReservadasComponent } from "./palabras-reservadas/actualizar/actualizar.component";
import { CrearPalabrasReservadasComponent } from "./palabras-reservadas/crear/crear.component";

import { BancosComponent } from "./bancos/bancos.component";
import { ActualizarBancosComponent } from "./bancos/actualizar/actualizar.component";
import { CrearBancosComponent } from "./bancos/crear/crear.component";

import { OperadorasComponent } from "./operadoras/operadoras.component";
import { ActualizarOperadorasComponent } from "./operadoras/actualizar/actualizar.component";
import { CrearOperadorasComponent } from "./operadoras/crear/crear.component";

import { TiposDeIdentificacionComponent } from "./tipos-de-identificacion/tipos-de-identificacion.component";
import { ActualizarTiposDeIdentificacionComponent } from "./tipos-de-identificacion/actualizar/actualizar.component";
import { CrearTiposDeIdentificacionComponent } from "./tipos-de-identificacion/crear/crear.component";

import { ParametrosComponent } from "./parametros/parametros.component";
import { ActualizarParametrosComponent } from "./parametros/actualizar/actualizar.component";

import { EventosComponent } from "./eventos/eventos.component";
import { DetallesEventoComponent } from "./eventos/detalles.component";

import { PagosComponent } from "./pagos/pagos.component";
import { DetallesPagoComponent } from "./pagos/detalles.component";

import { DigitelComponent } from "./digitel/digitel.component";
import { DetallesDigitelComponent } from "./digitel/detalles-digitel.component";

import { AfiliadosComponent } from "./afiliados/afiliados.component";
import { DetallesAfiliadoComponent } from "./afiliados/detalles.component";
import { DcardAfiliadoComponent } from "./afiliados/dcardAfiliados.component";
import { RecepAfiliadoComponent } from "./afiliados/recepAfiliados.component";
import { DistAfiliadoComponent } from "./afiliados/distAfiliados.component";

import { UsuariosComponent } from "./usuarios/usuarios.component";
import { DetallesUsuarioComponent } from "./usuarios/detalles.component";
import { CrearUsuarioComponent } from "./usuarios/crear.component";
import { ActualizarUsuarioComponent } from "./usuarios/actualizar.component";
import { CambioClaveComponent } from "./usuarios/cambio-clave.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { RegistrosBancariosComponent } from "./registros-bancarios/registros-bancarios.component";
import { RecargasComponent } from "./recargas/recargas.component";
import { LiquidacionComponent } from "./liquidacion/liquidacion.component";
import { LotesComponent } from "./lotes/lotes.component";
import { ComisionesComponent } from "./comisiones/comisiones.component";
import { ActualizarComisionComponent } from "./comisiones/actualizar-comision/actualizar-comision.component";

import { ParametrosTransporteComponent } from "./transporte/parametros-transporte/parametros-transporte.component";
import { LogTransporteComponent } from "./transporte/log-transporte/log-transporte.component";
import { ActualizarParametrosTransporteComponent } from "./transporte/parametros-transporte/actualizar/actualizar.component";
import { LogTransporteDetalleComponent } from "./transporte/log-transporte/log-transporte-detalle.component";

import { RolesUsuariosComponent } from "./roles-usuarios/roles-usuarios.component";
import { DetalleRolUsuarioComponent } from "./roles-usuarios/detalle-rol-usuario/detalle-rol-usuario.component";

const routes: Routes = [
  {
    path: "",
    component: PortalComponent,
    children: [
      {
        path: "welcome",
        component: WelcomeComponent,
      },
      {
        path: "catalogo/palabras-reservadas",
        component: PalabrasReservadasComponent,
      },
      {
        path: "catalogo/palabras-reservadas/actualizar/:id",
        component: ActualizarPalabrasReservadasComponent,
      },
      {
        path: "catalogo/palabras-reservadas/crear",
        component: CrearPalabrasReservadasComponent,
      },
      {
        path: "catalogo/bancos",
        component: BancosComponent,
      },
      {
        path: "catalogo/bancos/actualizar/:id",
        component: ActualizarBancosComponent,
      },
      {
        path: "catalogo/bancos/crear",
        component: CrearBancosComponent,
      },
      {
        path: "catalogo/operadoras",
        component: OperadorasComponent,
      },
      {
        path: "catalogo/operadoras/actualizar/:id",
        component: ActualizarOperadorasComponent,
      },
      {
        path: "catalogo/operadoras/crear",
        component: CrearOperadorasComponent,
      },
      {
        path: "catalogo/tipos-de-identificacion",
        component: TiposDeIdentificacionComponent,
      },
      {
        path: "catalogo/tipos-de-identificacion/actualizar/:id",
        component: ActualizarTiposDeIdentificacionComponent,
      },
      {
        path: "catalogo/tipos-de-identificacion/crear",
        component: CrearTiposDeIdentificacionComponent,
      },
      {
        path: "parametros",
        component: ParametrosComponent,
      },
      {
        path: "parametros/actualizar/:id",
        component: ActualizarParametrosComponent,
      },
      {
        path: "eventos",
        component: EventosComponent,
      },
      {
        path: "eventos/detalles/:id",
        component: DetallesEventoComponent,
      },
      {
        path: "pagos",
        component: PagosComponent,
      },
      {
        path: "pagos/detalles/:id/:tipo_movimiento",
        component: DetallesPagoComponent,
      },
      {
        path: "pago_de_servicios/digitel",
        component: DigitelComponent,
      },
      {
        path: "pago_de_servicios/digitel/detalles/:id",
        component: DetallesDigitelComponent,
      },
      {
        path: "afiliados",
        component: AfiliadosComponent,
      },
      {
        path: "afiliados/detalles/:id",
        component: DetallesAfiliadoComponent,
      },
      {
        path: "afiliados/dcard/:id",
        component: DcardAfiliadoComponent,
      },
      {
        path: "afiliados/recep/:id",
        component: RecepAfiliadoComponent,
      },
      {
        path: "afiliados/dist/:id",
        component: DistAfiliadoComponent,
      },
      {
        path: "usuarios",
        component: UsuariosComponent,
        //component: RolesUsuariosComponent
      },
      {
        path: "usuarios/detalles/:id",
        component: DetallesUsuarioComponent,
      },
      {
        path: "usuarios/crear",
        component: CrearUsuarioComponent,
      },
      {
        path: "usuarios/actualizar/:id",
        component: ActualizarUsuarioComponent,
      },
      {
        path: "cambio-clave",
        component: CambioClaveComponent,
      },
      {
        path: "registros-bancarios",
        component: RegistrosBancariosComponent,
      },
      {
        path: "recargas",
        component: RecargasComponent,
      },
      {
        path: "liquidacion",
        component: LiquidacionComponent,
      },
      {
        path: "lotes",
        component: LotesComponent,
      },
      {
        path: "comisiones/:transaccion/:tipo/:id",
        component: ActualizarComisionComponent,
      },
      {
        path: "comisiones",
        component: ComisionesComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "transporte/parametros-transporte",
        component: ParametrosTransporteComponent,
      },
      {
        path: "transporte/log-transporte",
        component: LogTransporteComponent,
      },
      {
        path: "transporte/parametros-transporte/actualizar/:id",
        component: ActualizarParametrosTransporteComponent,
      },
      {
        path: "transporte/log-transporte/detalles/:id",
        component: LogTransporteDetalleComponent,
      },
      // {
      // 	path: 'roles-usuarios',
      // 	component: RolesUsuariosComponent
      // },
      // {
      // 	path: 'roles-usuarios/:tipo/:id/:accion',
      // 	component: DetalleRolUsuarioComponent
      // },
      { path: "**", redirectTo: "dashboard" }, // error, ruta no encontrada
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
