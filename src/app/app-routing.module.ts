import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InicioSesionComponent } from "./entorno//inicio-sesion/inicio-sesion.component";

const routes: Routes = [
  { path: "", redirectTo: "/inicio-sesion", pathMatch: "full" },
  { path: "portal", loadChildren: "./portal/portal.module#PortalModule" },
  { path: "inicio-sesion", component: InicioSesionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
