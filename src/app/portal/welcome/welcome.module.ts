import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { WelcomeService } from './welcome.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    WelcomeService
  ]
})
export class EntornoModule { }