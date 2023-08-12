import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { MaterialModule } from './material/material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { DialogModule } from './dialogs/dialog.module';
import { DirectivesModule } from './directives/directives.module';
import { TableModule } from './table/table.module';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { NgxImageZoomComponent, NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SpinnerComponent
  ],
  imports: [ 
    CommonModule,    
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    DialogModule, 
    DirectivesModule,
    TableModule,
    AutocompleteLibModule,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    RouterModule,
    SpinnerComponent,
    DialogModule,
    DirectivesModule,
    TableModule,
    AutocompleteLibModule
   ],
   providers: [
   ],
   entryComponents:[PdfViewerComponent, NgxImageZoomComponent]
})
export class SharedModule { }