/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import {Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { I18N } from './consts';

@Pipe({ name: 'genericHintControlError' })
export class GenericHintControlErrorPipe implements PipeTransform {
  transform = (err: any, lang: string = 'pt') => { console.log(1);
    if ( !err || !(err instanceof Object) ) { return; }
    const i18n = (I18N[lang] || {validators: []});
    const firstError = String(Object.keys(err)[0]).toLocaleLowerCase();
    return i18n.validators[firstError];
  }
}

@Pipe({ name: 'genericSecurityTrustHtml'})
export class GenericSecurityTrustHtmlPipe implements PipeTransform {
  constructor(protected sanitize: DomSanitizer) {}
  transform = (html: string) => this.sanitize.bypassSecurityTrustHtml(html);
}

@Pipe({ name: 'translate'})
export class GenericTranslatePipe implements PipeTransform {
  constructor(protected sanitize: DomSanitizer) {}
  transform = (string: string, lang: string = 'pt') => string && (I18N[lang] || {})[string];
}
