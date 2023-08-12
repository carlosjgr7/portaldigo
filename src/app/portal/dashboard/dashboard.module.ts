import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DashboardService } from './dashboard.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }