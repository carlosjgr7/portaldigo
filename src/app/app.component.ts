import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import { EntornoService } from "./entorno/entorno.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private entorno: EntornoService
  ) {
    this.entorno.datosApi();

    this.matIconRegistry.addSvgIcon(
      "servicios",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../assets/images/icons/servicios.svg"
      )
    );
  }
}
