import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { EntornoService } from '../../entorno/entorno.service';
import { MenuItems } from '../menu-items/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent {

  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  
  private _mobileQueryListener: () => void;

  //public menuItems : any;

  constructor(changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, 
    public menuItems: MenuItems,
    private entorno: EntornoService) {

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}