import { NgModule } from "@angular/core";
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from "@angular/material-moment-adapter";

import { PortalRoutingModule } from "./portal-routing.module";

import { PortalComponent } from "./portal.component";
import { AppHeaderComponent } from "./header/header.component";
import { AppSidebarComponent } from "./sidebar/sidebar.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { MenuItems } from "./menu-items/menu-items";
import { SharedModule } from "../shared/shared.module";

import { PalabrasReservadasComponent } from "./palabras-reservadas/palabras-reservadas.component";
import { ActualizarPalabrasReservadasComponent } from "./palabras-reservadas/actualizar/actualizar.component";
import { CrearPalabrasReservadasComponent } from "./palabras-reservadas/crear/crear.component";
import { UpdatePalabraComponent } from "./palabras-reservadas/actualizar/actualizar.component";
import { DeletePalabrasReservadas } from "./palabras-reservadas/palabras-reservadas.component";

import { BancosComponent } from "./bancos/bancos.component";
import { ActualizarBancosComponent } from "./bancos/actualizar/actualizar.component";
import { UpdateBancoComponent } from "./bancos/actualizar/actualizar.component";
import { CrearBancosComponent } from "./bancos/crear/crear.component";
import { DeleteBancos } from "./bancos/bancos.component";

import { OperadorasComponent } from "./operadoras/operadoras.component";
import { ActualizarOperadorasComponent } from "./operadoras/actualizar/actualizar.component";
import { UpdateOperadoraComponent } from "./operadoras/actualizar/actualizar.component";
import { CrearOperadorasComponent } from "./operadoras/crear/crear.component";
import { DeleteOperadoras } from "./operadoras/operadoras.component";

import { TiposDeIdentificacionComponent } from "./tipos-de-identificacion/tipos-de-identificacion.component";
import { ActualizarTiposDeIdentificacionComponent } from "./tipos-de-identificacion/actualizar/actualizar.component";
import { UpdateTipoIdentificacionComponent } from "./tipos-de-identificacion/actualizar/actualizar.component";
import { CrearTiposDeIdentificacionComponent } from "./tipos-de-identificacion/crear/crear.component";
import { DeleteTiposDeIdentificacion } from "./tipos-de-identificacion/tipos-de-identificacion.component";

import { ParametrosComponent } from "./parametros/parametros.component";
import { ActualizarParametrosComponent } from "./parametros/actualizar/actualizar.component";
import { UpdateParametroComponent } from "./parametros/actualizar/actualizar.component";

import { EventosComponent } from "./eventos/eventos.component";
import { DetallesEventoComponent } from "./eventos/detalles.component";

import { PagosComponent } from "./pagos/pagos.component";
import { DetallesPagoComponent } from "./pagos/detalles.component";

import { DigitelComponent } from "./digitel/digitel.component";
import { DetallesDigitelComponent } from "./digitel/detalles-digitel.component";

import { AfiliadosComponent } from "./afiliados/afiliados.component";
import { DetallesAfiliadoComponent } from "./afiliados/detalles.component";
import { DeleteAfiliadosComponent } from "./afiliados/afiliados.component";
import { UpdateAfiliadosComponent } from "./afiliados/detalles.component";
import { DcardAfiliadoComponent } from "./afiliados/dcardAfiliados.component";
import { RecepAfiliadoComponent } from "./afiliados/recepAfiliados.component";
import { DistAfiliadoComponent } from "./afiliados/distAfiliados.component";

import { UsuariosComponent } from "./usuarios/usuarios.component";
import { DeleteUsuarios } from "./usuarios/usuarios.component";
import {
  DetallesUsuarioComponent,
  ReestablecerPasswordAdminComponent,
} from "./usuarios/detalles.component";
import { CrearUsuarioComponent } from "./usuarios/crear.component";
import { ActualizarUsuarioComponent } from "./usuarios/actualizar.component";
import { UpdateUsuarioComponent } from "./usuarios/actualizar.component";
import { CambioClaveComponent } from "./usuarios/cambio-clave.component";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { BancosService } from "./bancos/bancos.service";
import { ConfirmationDialogComponent } from "../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import { RegistrosBancariosModule } from "./registros-bancarios/registros-bancarios.module";
import { RecargasModule } from "./recargas/recargas.module";
import { CompletedDialogComponent } from "../shared/dialogs/completed-dialog/completed-dialog.component";
import { LiquidacionModule } from "./liquidacion/liquidacion.module";
import { LotesModule } from "./lotes/lotes.module";
import { TableDialogComponent } from "../shared/dialogs/table-dialog/table-dialog.component";
import { ComisionesModule } from "./comisiones/comisiones.module";
import { VisualizarArchivoDialogComponent } from "../shared/dialogs/visualizar-archivo-dialog/visualizar-archivo-dialog.component";
import { AlertDialogComponent } from "../shared/dialogs/alert-dialog/alert-dialog.componetn";
import { InformacionFinancieraDialogComponent } from "../shared/dialogs/informancion-financiera-dialog/informacion-financiera-dialog.component";
import { DcardDialogComponent } from "../shared/dialogs/dcard-dialog/dcard-dialog.component";
import { DcardGestionesDialogComponent } from "../shared/dialogs/dcard-gestiones-dialog/dcard-gestiones-dialog.component";
import { DcardDistribucionDialogComponent } from "../shared/dialogs/dcard-distribucion-dialog/dcard-distribucion-dialog.component";
import { DcardRecepDialogComponent } from "../shared/dialogs/dcard-recep-dialog/dcard-recep-dialog.component";
import { DcardActivacionDialogComponent } from "../shared/dialogs/dcard-activacion-dialog/dcard-activacion-dialog.component";
import { DcardBloqueoDialogComponent } from "../shared/dialogs/dcard-bloqueo-dialog/dcard-bloqueo-dialog.component";
import { DcardPerdidaDialogComponent } from "../shared/dialogs/dcard-perdida-dialog/dcard-perdida-dialo.component";
import { DcardRoboDialogComponent } from "../shared/dialogs/dcard-robo-dialog/dcard-robo-dialog.component";
import { DcardDeterioroDialogComponent } from "../shared/dialogs/dcard-deterioro-dialog/dcard-deterioro-dialog.component";
import { DcardGeneralDialogComponent } from "../shared/dialogs/dcard-general-dialog/dcard-general-dialog.component";
import { DcardVerGeneralDialogComponent } from "../shared/dialogs/dcard-vergeneral-dialog/dcard-vergeneral-dialog.component";
import {
  ListaRecaudosDialogComponent,
  UpdateRecaudosComponent,
} from "../shared/dialogs/lista-recaudos-dialog/lista-recaudos-dialog.component";
import { LogTransporteComponent } from "./transporte/log-transporte/log-transporte.component";
import { ParametrosTransporteComponent } from "./transporte/parametros-transporte/parametros-transporte.component";
import { ActualizarParametrosTransporteComponent } from "./transporte/parametros-transporte/actualizar/actualizar.component";
import { UpdateParametroTransporteComponent } from "./transporte/parametros-transporte/actualizar/actualizar.component";
import { LogTransporteDetalleComponent } from "./transporte/log-transporte/log-transporte-detalle.component";
// import { RolesUsuariosComponent, DeleteUsuarios } from './roles-usuarios/roles-usuarios.component';
// import { DetalleRolUsuarioComponent, ReestablecerPasswordAdminComponent, UpdateUsuarioComponent } from './roles-usuarios/detalle-rol-usuario/detalle-rol-usuario.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PortalComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    WelcomeComponent,
    PalabrasReservadasComponent,
    ActualizarPalabrasReservadasComponent,
    UpdatePalabraComponent,
    CrearPalabrasReservadasComponent,
    DeletePalabrasReservadas,
    BancosComponent,
    ActualizarBancosComponent,
    UpdateBancoComponent,
    CrearBancosComponent,
    DeleteBancos,
    OperadorasComponent,
    ActualizarOperadorasComponent,
    UpdateOperadoraComponent,
    CrearOperadorasComponent,
    DeleteOperadoras,
    TiposDeIdentificacionComponent,
    ActualizarTiposDeIdentificacionComponent,
    UpdateTipoIdentificacionComponent,
    CrearTiposDeIdentificacionComponent,
    DeleteTiposDeIdentificacion,
    ParametrosComponent,
    ActualizarParametrosComponent,
    UpdateParametroComponent,
    EventosComponent,
    DetallesEventoComponent,
    PagosComponent,
    DetallesPagoComponent,
    DigitelComponent,
    DetallesDigitelComponent,
    AfiliadosComponent,
    DetallesAfiliadoComponent,
    DeleteAfiliadosComponent,
    UpdateAfiliadosComponent,
    DcardAfiliadoComponent,
    RecepAfiliadoComponent,
    DistAfiliadoComponent,
    UsuariosComponent,
    DeleteUsuarios,
    DetallesUsuarioComponent,
    CrearUsuarioComponent,
    ActualizarUsuarioComponent,
    UpdateUsuarioComponent,
    CambioClaveComponent,
    DashboardComponent,
    ReestablecerPasswordAdminComponent,
    LogTransporteComponent,
    ParametrosTransporteComponent,
    ActualizarParametrosTransporteComponent,
    UpdateParametroTransporteComponent,
    LogTransporteDetalleComponent,
    UpdateRecaudosComponent,
    // RolesUsuariosComponent,
    // DetalleRolUsuarioComponent,
  ],
  entryComponents: [
    DeletePalabrasReservadas,
    DeleteBancos,
    DeleteOperadoras,
    DeleteTiposDeIdentificacion,
    DeleteAfiliadosComponent,
    DeleteUsuarios,
    UpdateAfiliadosComponent,
    UpdateBancoComponent,
    UpdateOperadoraComponent,
    UpdatePalabraComponent,
    UpdateTipoIdentificacionComponent,
    UpdateParametroComponent,
    UpdateParametroTransporteComponent,
    UpdateUsuarioComponent,
    ReestablecerPasswordAdminComponent,
    ConfirmationDialogComponent,
    AlertDialogComponent,
    CompletedDialogComponent,
    VisualizarArchivoDialogComponent,
    InformacionFinancieraDialogComponent,
    DcardDialogComponent,
    DcardGestionesDialogComponent,
    DcardDistribucionDialogComponent,
    DcardRecepDialogComponent,
    DcardActivacionDialogComponent,
    DcardBloqueoDialogComponent,
    DcardPerdidaDialogComponent,
    DcardGeneralDialogComponent,
    DcardRoboDialogComponent,
    DcardDeterioroDialogComponent,
    DcardVerGeneralDialogComponent,
    ListaRecaudosDialogComponent,
    UpdateRecaudosComponent,
    TableDialogComponent,
  ],
  imports: [
    PortalRoutingModule,
    SharedModule,
    RegistrosBancariosModule,
    RecargasModule,
    LiquidacionModule,
    LotesModule,
    ComisionesModule,
    //NgMultiSelectDropDownModule,
  ],
  providers: [
    MenuItems,
    BancosService,
    { provide: MAT_DATE_LOCALE, useValue: "es-VE" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class PortalModule {}
