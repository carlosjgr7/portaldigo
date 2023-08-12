import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorIntl } from '@angular/material';

import { TableComponent } from './table.component';
import { SortColumnsComponent } from './sort-columns/sort-columns.component';
import { SubStringCheckPipe } from '../pipes/subStringCheck.pipe';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';
import { MaterialModule } from '../material/material.module';
import { ExcelService } from '../../excel/excel.service';
import { MatPaginatorIntlEsp } from './paginator/matPaginatorEsp';
import { TableService } from './table.service';

import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  declarations: [
    TableComponent,
    SortColumnsComponent,
    SubStringCheckPipe,
    CdkDetailRowDirective,
  ],
  imports: [ 
    CommonModule,    
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    DirectivesModule
  ],
  exports: [
    TableComponent,
    DirectivesModule
   ],
   entryComponents: [
    SortColumnsComponent,
   ],
   providers: [
    ExcelService,
    TableService,
    DatePipe,
    DecimalPipe,
    SubStringCheckPipe,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp},
   ],
})
export class TableModule { }