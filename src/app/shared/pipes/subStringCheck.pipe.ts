import { Pipe, PipeTransform } from '@angular/core';
/*
 * Checks for a Substring
 * If the substring is found replaces for ''
 * Else returns same string
 * Particulary usefull for undefined values in table
 * Takes an substring argument that defaults to 'undefined'.
 * Usage:
 *   value | subStringCheck:substring
 * Example:
 *   {{ qlqMenor | subStringCheck:'qlq' }}
 *   formats to: ''
 * Else Example:
 *   {{ prueba | subStringCheck }}
 *   formats to: 'prueba'
*/
@Pipe({name: 'subStringCheck'})
export class SubStringCheckPipe implements PipeTransform {
  transform(value: string, substring?: string): string {
    if (value.includes(substring != undefined ? substring : 'undefined')) {
        return '';
    }
    else {
        return value;
    }
  }
}