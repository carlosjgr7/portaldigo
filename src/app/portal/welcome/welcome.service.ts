import { Injectable }from '@angular/core';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import {of} from "rxjs/observable/of";

import { environment } from '../../../environments/environment';

import { EntornoService } from '../../entorno/entorno.service';



@Injectable()
export class WelcomeService {

  constructor (private http: HttpClient, private entornoService: EntornoService) {}


  
}