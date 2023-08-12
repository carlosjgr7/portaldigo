import { MediaMatcher } from "@angular/cdk/layout";
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
} from "@angular/core";
import { MenuItems } from "./menu-items/menu-items";

import { Router } from "@angular/router";

import { EntornoService } from "../entorno/entorno.service";

import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import * as $ from "jquery";

@Component({
  selector: "app-portal",
  templateUrl: "portal.component.html",
})
export class PortalComponent implements AfterViewInit, OnDestroy {
  mobileQuery: MediaQueryList;
  dir = "ltr";
  green: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide: boolean;
  sidebarOpened;

  public config: PerfectScrollbarConfigInterface = {};

  private _mobileQueryListener: () => void;

  public loggedIn: boolean = false;

  public user_name: string;

  public ultima_conexion: string;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private entorno: EntornoService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    var logged: any = this.entorno.auth();

    if (logged.auth) {
      this.user_name = logged.user.nombre_completo;

      this.ultima_conexion = logged.user.ultima_conexion;

      this.router.navigate(["portal"]);
    } else {
      this.entorno.caduco_sesion = "Debe iniciar sesion";

      this.router.navigate(["inicio-sesion"]);
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {
    //This is for the topbar search
    (<any>$(".srh-btn, .cl-srh-btn")).on("click", function () {
      (<any>$(".app-search")).toggle(200);
    });
  }
}
