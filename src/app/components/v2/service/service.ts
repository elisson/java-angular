/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filterObject } from '../helpers';

export type IBackendQueryConstaintFilterType = 'contains' | 'equals' | 'in';

export type IBackendDataType = 'string' | 'number' | 'boolean';

export interface IBackendFileAndData {
  file: HTMLInputElement | File;
  data?: object;
}

export interface IBackendQueryConstaintFilter {
  [key: string]: {
    type: IBackendDataType;
    notNull: boolean;
    queryType: IBackendQueryConstaintFilterType;
  };
}

export interface IBackendQueryFilter {
  [key: string]: [IBackendQueryConstaintFilterType, any];
}

export interface IBackend {
  url: URL | string;
  private_url?: string;
  primary_key: string;
  key_pattern: RegExp;
  query_constraint?: Array<IBackendQueryConstaintFilter>;
}

export class GenericService implements IBackend {
  url: URL | string = '';
  primary_key = '';
  key_pattern: RegExp = /.+/;
  /** current url as String
   * @returns String
   * */
  get current_url(): string { return this._is_private ? this['private_url'] : this['url']; }
  /* pattern  as filter parameter for resource object */
  /* pattern  as filter parameter in object query*/
  protected _OBJECT_TO_QUERY_IGNORE_PATTERN_: RegExp = /[^in_trash]/;
  /* identifier for request using private_url instead regular url in Ibackend Interface*/
  private _is_private = false;
  /*current URL object*/
  private URL: URL;
  /* string to concat with current url */
  fragment = '';
  constructor(public http: HttpClient) { }
  /** changes the current url to private_url
   * @returns Backend
  * */
  private = (): GenericService => { this._is_private = true; return this; };
  /** set the key_pattern
   * @returns Backend
   * @param reg: RegExp
   * */
  setKeyPattern = (reg: RegExp): GenericService => (this['key_pattern'] = reg) && this;
  /** set the url fragment
   * @returns Backend
   * @param str: String
   * */
  setFragment = (str: string): GenericService => (this.fragment = str) && this;
  /** append string to the url fragment
   * @returns Backend
   * @param str: String
   * */
  addFragment = (str: string): GenericService => this.setFragment((this.fragment || '').concat(str));
  /**
   * @returns URLSearchParams
   * */
  searchParams = (): URLSearchParams => this._asURL().searchParams;
  /** set the DOM URL object
   * @returns Backend
   * */
  buildURL = (): GenericService => (this.URL = this._asURL()) && this;
  /** resolve current string url to a DOM URL instance
   * @returns URL
   * */
  private _asURL = (): URL => this.URL && this.URL['origin'] ? this.URL : new URL(this.current_url);
  /** string cleansing
   * @param str: String
   * @returns string
   * */
  private _replace = (str: string): string => str.replace(/\/{2,}/g, '/').replace(/\/\?/g, '?').replace(/^\//g, '');
  /** build the final url string for a request
   * @param str: String
   * @returns string
   * */
  private _concat = (str: string): string => {
    // this.URL = this._asURL();
    this._is_private = false;
    return this.URL.origin.toString()
      .concat('/' + this._replace(this.URL.pathname + str))
      .concat(this.URL.search)
      .replace(/\/$/, '');
  }
  /** Request without filters
   * @returns Observable
   * */
  fetch = (): Observable<any> => this.http.get(this._no_query()._concat(this.fragment));
  /** Request with filters as Object
   * @param object: Object, fields: Array | string, endURLString: string
   * @param fields: Array | string, endURLString: string
   * @param endURLString: string
   * @returns Observable
   * */
  filter = (object: Object, fields?: string | Array<string>, endURLString?: string)
    : Observable<any> => this.query(this.objectToFilters(object), fields, endURLString)
  /** Request with filters as Array<{[T: string]: Array<[string, string]>}>
   * @param queryFilters: Array<{T: string}>
   * @param fields: Array | string, endURLString: string
   * @param endURLString: string
   * @returns Observable
   * */
  query = (queryFilters: Array<IBackendQueryFilter>, fields?: string | Array<string>, endURLString?: string)
    : Observable<any> => {
    this.buildURL();
    if (typeof fields === 'string' && fields.length) {
      this.searchParams().set('fields',
        JSON.stringify(fields.replace(/\s/g, '').split(','))
      );
    } else if (fields && Array.isArray(fields)) {
      this.searchParams().set('fields', JSON.stringify(fields));
    } else {
      this.searchParams().delete('fields');
    }
    if (queryFilters[0] && 'hasOwnProperty' in queryFilters[0] && Object.keys(queryFilters[0]).length) {
      this.searchParams().set('filters', JSON.stringify(queryFilters));
    } else { this.searchParams().delete('filters'); }
    return this.http.get(this._concat(endURLString || this.fragment));
  }
  private _no_query = () => (this.URL = new URL(this.current_url)) && this;
  /** Request a resource by unique key
   * @param resourceID: number | string
   * @returns Observable
   * */
  resource = (resourceID: number | string)
    : Observable<any> => {
    if (!resourceID) { throw Error('resourceID is required'); }
    return this.http.get(this._no_query()._concat('/' + this.fragment + '/' + resourceID));
  }
  /** Update resource by unique key
   * @param resourceID: number | string
   * @param object: Object
   * @returns Observable
   * */
  update = (resourceID: number | string, object: Object)
    : Observable<any> => {
    if (!resourceID) { throw Error('resourceID is required'); }
    return this.http.put(this._no_query()._concat('/'.concat(this.fragment, resourceID as string)), filterObject(object, this['key_pattern']));
  }
  /** Destroy resource by unique key
   * @param resourceID: number | string
   * @returns Observable
   * */
  destroy = (resourceID: number | string)
    : Observable<any> => {
    if (!resourceID) { throw Error('resourceID is required'); }
    return this.http.delete(this._no_query()._concat('/' + this.fragment + '/' + resourceID));
  }
  /** Save a new resource
   * @param object: Object
   * @returns Observable
   * */
  store = (object: Object | any)
    : Observable<any> => {
    if (!object || typeof object !== 'object') { throw Error('param is required'); }
    return object.id ? this.update(object.id, object) :
     this.http.post(this._no_query()._concat('/' + this.fragment), filterObject(object, this['key_pattern']));
  }
  /** Partial update a resource by unique key
   * @param resourceID: number | string
   * @param object: Object
   * @returns Observable
   * */
  patch = (resourceID: number | string, object: Object)
    : Observable<any> => {
    if (!resourceID) { throw Error('resourceID is required'); }
    return this.http.patch(this._no_query()._concat('/' + this.fragment + '/' + resourceID), filterObject(object, this['key_pattern']));
  }
  /** Upload a resource with a archive file and optional data input object
   * @param fileAndData: IBackendFileAndData
   * @param httpHeaders?: HttpHeaders
   * @returns Observable
   * */
  upload = (fileAndData: IBackendFileAndData, httpHeaders?: HttpHeaders)
    : Observable<any> => {
    const { form, headers } = this.createFormAndHeadersWithFileAndData(fileAndData, httpHeaders);
    return this.http.post(this._no_query()._concat(this.fragment), form, { headers });
  }
  /** turns the object input into a server filters schema
   *  and apply object's property query_constraint if defined in the class children
   * @param object: Object
   * @returns Array<object>
   * */
  objectToFilters = (object: Object)
    : Array<IBackendQueryFilter> => {
    const query_constraint: IBackend['query_constraint'] = this['query_constraint'];
    const _queryMap = {};
    Object.keys(filterObject(object, this._OBJECT_TO_QUERY_IGNORE_PATTERN_))
      .map(key => {

        const objectValue = object[key];
        const isString = typeof objectValue === 'string';
        if (query_constraint && query_constraint.hasOwnProperty(key)) {
          const constraint = query_constraint[key];
          if (!constraint.notNull) {
            _queryMap[key] = [constraint.queryType, String(constraint.type).includes('string')
              ? objectValue.replace(/\++/, ' ') : (String(constraint.type).includes('number') ? Number(objectValue) : objectValue)];
          }
        } else if (!isNaN(objectValue) || isString && objectValue.length) {
          _queryMap[key] = [!isNaN(objectValue) || /^(true|false)$/.test(objectValue)
            ? 'equals' : 'contains', isString ? objectValue.replace(/\++/, ' ') : objectValue];
        }
      });
    if ({} !== _queryMap) { console.log('[QUERY FILTERS]:'); console.table(_queryMap); }
    return [_queryMap];
  }
  /** turns the object input into a server filters schema
   *  and apply object's property query_constraint if defined in the class children
   * @param fileAndData: IBackendFileAndData
   * @param httpHeaders?: HttpHeaders
   * @returns Object<{form: FormData, headers: HttpHeaders}>
   * */
  createFormAndHeadersWithFileAndData = (fileAndData: IBackendFileAndData, httpHeaders?: HttpHeaders)
    : { form: FormData, headers: HttpHeaders } => {
    const { file, data } = fileAndData;
    const form = new FormData();
    const headers: HttpHeaders = httpHeaders || new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    if (!(file instanceof File)) {
      if (!(file instanceof HTMLInputElement)) { throw new Error('File is required for a upload form'); }
      form.append('file', (<HTMLInputElement>file).files[0] as File);
    } else { form.append('file', file as File); } // avoiding typo with as File statement
    Object.keys(filterObject(data, this['key_pattern']) || {}).map(i => form.append(i, data[i]));
    return { form, headers };
  }
}
