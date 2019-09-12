/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { Observable } from 'rxjs';
import * as moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');

const NUMERIC = /^[0-9]+$/,
  BR_ALPHA = /^[a-zÀ-ú]+$/i,
  BR_ALPHANUMERIC = /^[0-9a-zÀ-ú]+$/i,
  BR_ALPHANUMERIC_SPACE = /^[a-zÀ-ú\s]+$/i,
  ALPHA = /^[a-z]+$/i,
  ALPHANUMERIC = /^[0-9a-z]+$/i,
  ALPHANUMERIC_SPACE = /^[a-z\s]+$/i,
  BOOLEAN = /^(false|true)$/,
  NICK_NAME = /^[a-z_\-.]+$/i,
  DECIMAL3 = /^([0-9]+)(\.[0-9]{1,3})?$/,
  DATE_ISO = /^[0-9]{4}(\/|\-)(0[1-9]|1[0-2])(\/|\-)(0[1-9]|[1-2][0-9]|3[0-1])$/,
  DATE_PT_BR = /^(0[1-9]|[1-2][0-9]|3[0-1])(\/|\-)(0[1-9]|1[0-2])(\/|\-)[0-9]{4}$/,
  MIME_IMAGE = /^image\/(jpe?g|png)$/g,
  MIME_EXCEL = /^application\/(vnd\.ms-excel|.+sheet)/g;

const FILES_EXTENSIONS = {
  '.png': { mime: 'image/png' },
  '.jpg': { mime: 'image/jpeg' },
  '.jpeg': { mime: 'image/jpeg' },
  '.pdf': { mime: 'application/pdf' },
  '.doc': { mime: 'application/msword' },
  '.docx': {
    mime:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  '.xls': { mime: 'application/vnd.ms-excel' },
  '.xlsx': {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  '.ppt': { mime: 'application/vnd.ms-powerpoint' },
  '.pptx': {
    mime:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  '.txt': { mime: 'text/plain' },
  '': { mime: 'application/octet-stream' }
};

/** @description enum of mimes
 * @returns  Boolean
 * @param o: IGenericSelect | any
 **/
const FILES_MIMES = {};
Object.keys(FILES_EXTENSIONS).map(ext =>
  Object.assign(FILES_MIMES, { [FILES_EXTENSIONS[ext].mime]: ext })
);

export const randomInt = (min = 0, max = 255) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isColor = (str: string) => /^#([a-z0-9]{3}|[a-z0-9]{6})|^rgba?\([0-9,.]{3,}\)$/gi.test((str || '').trim());

export const fileSize = (bites: number) => {
  const kbites = bites / 1024;
  if (kbites <= .09 ) {
    return (kbites * 1024).toFixed(1) + 'B';
  } else if ( kbites <= 1023 ) {
    return kbites.toFixed(1) + 'KB';
  } else {
    const mbites = Math.round(kbites / 1024);
    if (mbites <= 1023) {
      return mbites.toFixed(1) + 'MB';
    }
    return (mbites / 1024).toFixed(1) + 'GB';
  }
};

export const base64ToBytes = (str: string): Observable<any> =>
  Observable.create((observable: any) => {
    try {
      let imgStr = str;
      imgStr = imgStr.substr(imgStr.indexOf(',') + 1);
      const binary_string = window.atob(imgStr);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      observable.next(bytes);
    } catch (e) {
      observable.error(e);
    }
  });

export const base64ToFile = (
    base64: string
  , fileName: string = 'file'
  , fileType?: string): Observable<any> =>
  Observable.create((observable: any) => base64ToBytes(base64).subscribe(bytes =>
    observable.next(new File([bytes], fileName, { type: fileType }))
  , e => observable.error(e)));

/** @description turn string into moment date object
  * @param dateString: string
  * @param seconds: string
  * @returns moment|''
  **/
export const momentDateFromString = (dateString: any = '', seconds?: string): any => {
  const _seconds = seconds ? ' ' + seconds : ' 00:00:00';
  if ( dateString instanceof Date) {
    return moment(dateString);
  }
  const _dateString = dateString.substr(0, 10).replace(/\//g, '-');
  if (REG_EXP.DATE_PT_BR.test(_dateString)) {
    const pices = _dateString.split('-');
    return moment(new Date(pices[2] + '-' + pices[1] + '-' + pices[0] + _seconds));
  } else if (REG_EXP.DATE_ISO.test(_dateString)) {
    return moment(new Date(_dateString + _seconds));
  }
  return '';
};

export const momentToDB = (date: any) => date.format('YYYY-MM-DD HH:mm:ss');

export const momentToPT_BR = (date: any) => date.format('DD/MM/YYYY HH:mm:ss');

export const filterObject = (
    object: Object
  , pattern: RegExp = /^[^__.+]/
  , defaults: { [key: string]: any } = {}) => {
  Object.keys(object).filter(i => pattern.test(i))
    .map(f => Object.assign(defaults, { [f]: object[f] }));
  return defaults;
};

export const REG_EXP = {
  NUMERIC,
  BR_ALPHA,
  BR_ALPHANUMERIC,
  BR_ALPHANUMERIC_SPACE,
  ALPHA,
  ALPHANUMERIC,
  ALPHANUMERIC_SPACE,
  BOOLEAN,
  NICK_NAME,
  DATE_ISO,
  DATE_PT_BR,
  DECIMAL3,
  MIME_IMAGE,
  MIME_EXCEL
},
FILES = { FILES_EXTENSIONS, FILES_MIMES };
