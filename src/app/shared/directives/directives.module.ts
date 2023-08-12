import { NgModule } from "@angular/core";

import { AfterIfDirective } from "./after-if.directive";
import { NumbersOnlyDirective } from "./numbers-only.directive";
import { NumbersPuntuationDirective } from "./numbers-puntuation.directive";
import { DisableControlDirective } from "./disabled-control.directive";
import { PorcentajeDecimalNumberDirective } from "./decimal.directive";
import { DocumentDirective } from "./document.directive";
import { CampoMontoDirective } from "./campo-monto";
import { LettersNumbersOnlyDirective } from "./letters-numbers-only.directive";
import { FilterDirective } from "./filter.directive";
import { EmailDirective } from "./email.directive";
import { PasswordDirective } from "./password.directive";
import { TextNumbersDirective } from "./text-numbers.directive";

@NgModule({
    declarations: [
        AfterIfDirective,
        NumbersOnlyDirective,
        NumbersPuntuationDirective,
        DisableControlDirective,
        PorcentajeDecimalNumberDirective,
        DocumentDirective,
        CampoMontoDirective,
        LettersNumbersOnlyDirective,
        FilterDirective,
        EmailDirective,
        PasswordDirective,
        TextNumbersDirective
    ],
    exports: [
        AfterIfDirective,
        NumbersOnlyDirective,
        NumbersPuntuationDirective,
        DisableControlDirective,
        PorcentajeDecimalNumberDirective,
        DocumentDirective,
        CampoMontoDirective,
        LettersNumbersOnlyDirective,
        FilterDirective,
        EmailDirective,
        PasswordDirective,
        TextNumbersDirective
    ],
  })
  export class DirectivesModule { }