import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EntornoService } from '../../entorno/entorno.service';

var element_data: any = [];

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [
  ]
})
export class WelcomeComponent implements OnInit { 

	constructor(private entornoService: EntornoService, private router: Router) {}

  ngOnInit() {


    
  }

  onRefreshPagos() {


    
  }

}

