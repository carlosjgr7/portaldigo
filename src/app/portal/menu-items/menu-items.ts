import { Injectable } from '@angular/core';
import { EntornoService } from '../../entorno/entorno.service';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface Separator {
  name: string;
  type?: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  separator?: Separator[];    
  children?: ChildrenItems[];
}

const ADMIN = [
    {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'home'
    },
    {
        state: 'pagos',
        name: 'Pagos',
        type: 'link',
        icon: 'money'
    },
    {
        state: 'pago_de_servicios',
        name: 'Pago de Servicios',
        type: 'sub',
        icon: 'group_work',
        badge: [
            {type: 'gray', value: '1'}
        ],
        children: [
            {state: 'digitel', name: 'Conciliación Digitel'}
        ]
    },
    {
        state: 'recargas',
        name: 'Autorización Recargas',
        type: 'link',
        icon: 'assessment'
    }, 
    {
        state: 'registros-bancarios',
        name: 'Registros Bancarios',
        type: 'link',
        icon: 'post_add'
    }, 
    {
        state: 'liquidacion',
        name: 'Liquidación Ordenes',
        type: 'link',
        icon: 'attach_money'
    },
    {
        state: 'lotes',
        name: 'Gestión Lotes',
        type: 'link',
        icon: 'ballot'
    },
    {
        state: 'comisiones',
        name: 'Administración Comisiones',
        type: 'link',
        icon: 'point_of_sale'
    },
    {
        state: 'afiliados',
        name: 'Afiliados',
        type: 'link',
        icon: 'supervisor_account'
    }, 
    {
        
        state: 'transporte',
        name: 'Transporte',
        type: 'sub',
        icon: 'commute',
        badge: [
            {type: 'gray', value: '2'}
        ],
        children: [
            {state: 'parametros-transporte', name: 'Parámetros'},
            {state: 'log-transporte', name: 'Log de Transporte'}  
        ]
    }, 
    {
        state: 'catalogo',
        name: 'Catálogo',
        type: 'sub',
        icon: 'group_work',
        badge: [
            {type: 'gray', value: '4'}
        ],
        children: [
            {state: 'bancos', name: 'Bancos'},
            {state: 'operadoras', name: 'Operadoras'},
            {state: 'palabras-reservadas', name: 'Palabras reservadas'},
            {state: 'tipos-de-identificacion', name: 'Tipos de identificación'}    
        ]
    }, 
    {
        state: 'parametros',
        name: 'Parámetros',
        type: 'link',
        icon: 'settings'
    },
    {
        state: 'eventos',
        name: 'Visor de eventos',
        type: 'link',
        icon: 'visibility'
    },
    {
        state: 'usuarios',
        name: 'Usuarios',
        type: 'link',
        icon: 'person'
    }
];

const TECBANCA =
[
    {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'home'
    },
    {
        state: 'pagos',
        name: 'Pagos',
        type: 'link',
        icon: 'money'
    },
    {
        state: 'pago_de_servicios',
        name: 'Pago de Servicios',
        type: 'sub',
        icon: 'group_work',
        badge: [
            {type: 'gray', value: '1'}
        ],
        children: [
            {state: 'digitel', name: 'Conciliación Digitel'}
        ]
    },
    {
        state: 'recargas',
        name: 'Autorización Recargas',
        type: 'link',
        icon: 'assessment'
    }, 
    {
        state: 'registros-bancarios',
        name: 'Registros Bancarios',
        type: 'link',
        icon: 'post_add'
    },
    {
        state: 'transporte',
        name: 'Transporte',
        type: 'sub',
        icon: 'commute',
        badge: [
            {type: 'gray', value: '2'}
        ],
        children: [
            {state: 'parametros-transporte', name: 'Parámetros'}
        ]
    }
];

const MENUITEMS = [
    {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'home'
    },
    {
        state: 'pagos',
        name: 'Pagos',
        type: 'link',
        icon: 'money'
    }, 
   /* {
        state: 'pago_de_servicios',
        name: 'Pago de Servicios',
        type: 'sub',
        icon: 'group_work',
        badge: [
            {type: 'gray', value: '1'}
        ],
        children: [
            {state: 'digitel', name: 'Conciliación Digitel'}
        ]
    }, */
    {
        state: 'recargas',
        name: 'Autorización Recargas',
        type: 'link',
        icon: 'assessment'
    }, 
    {
        state: 'registros-bancarios',
        name: 'Registros Bancarios',
        type: 'link',
        icon: 'post_add'
    }, 
    {
        state: 'liquidacion',
        name: 'Liquidación Ordenes',
        type: 'link',
        icon: 'attach_money'
    },
    {
        state: 'lotes',
        name: 'Gestión Lotes',
        type: 'link',
        icon: 'ballot'
    },
    {
        state: 'afiliados',
        name: 'Afiliados',
        type: 'link',
        icon: 'supervisor_account'
    }/*, 
    {
        state: 'comisiones',
        name: 'Administración Comisiones',
        type: 'link',
        icon: 'point_of_sale'
    },
    {
        state: 'catalogo',
        name: 'Catálogo',
        type: 'sub',
        icon: 'group_work',
        badge: [
            {type: 'gray', value: '4'}
        ],
        children: [
            {state: 'bancos', name: 'Bancos'},
            {state: 'operadoras', name: 'Operadoras'},
            {state: 'palabras-reservadas', name: 'Palabras reservadas'}  
        ]
    }, 
    {
        state: 'parametros',
        name: 'Parámetros',
        type: 'link',
        icon: 'settings'
    },
    {
        state: 'eventos',
        name: 'Visor de eventos',
        type: 'link',
        icon: 'visibility'
    }*/
];

@Injectable()
export class MenuItems {
    constructor(private entorno: EntornoService) {}
  getMenuitem(): Menu[] {
    let auth : any = this.entorno.auth();
    let rtrn : any;
    switch(auth.user.rol) { 
        case "ADMIN": { 
           //statements; 
            rtrn = ADMIN;
           break; 
        } 
        case "ADMIN_OPERACIONES": {
            rtrn = ADMIN.filter( i => i.state != 'eventos' && i.state != 'parametros' && i.state != 'catalogo' && i.state != 'usuarios');
            break;
        }
        case "CONTACT_CENTER":{
            rtrn = ADMIN.filter(i => i.state != 'liquidacion' && i.state != 'lotes' && i.state != 'transporte');
            break;
        }
        case "OPERACIONES":
        {
            rtrn = ADMIN.filter(i => i.state != 'comisiones');
            break;
        }
        case "AUDITORIA":
        {
            rtrn = ADMIN.filter(i => i.state != 'comisiones');
            break;
        }
        case "TEC_BANCA_DIGITAL":
        {
            rtrn = TECBANCA;
            break;
        }
        default: { 
            rtrn = MENUITEMS;
           //statements; 
           break; 
        } 
     }

     return rtrn;
    
  }
}