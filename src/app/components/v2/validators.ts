/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';

/* HTML input types accepted by MatInput */
declare type MatInputTypes =
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';
/* Accepted component types */
declare type IGenericFormItemTypes =
  | 'select'
  | 'autocomplete'
  | 'slide-toggle'
  | 'checkbox'
  | 'datepicker'
  | 'file'
  | 'textarea'
  | MatInputTypes;
/* Data output for change events */
export interface IGenericChange {
  FormGroup: FormGroup;
  forms: IGenericFormItem[];
}
/* data model for form buttons */
export interface IGenericButton {
  label: string;
  type: 'button' | 'submit' | 'reset' | null;
  ngClass?: any;
  color?: 'primary' | 'warn' | 'accent';
  disabled?: boolean;
  parent?: { ngClass: any };
  onClick?(T: IGenericChange | Event);
}
/* data model for select|autocomplete */
export interface IGenericSelect {
  /* input value */
  value: any;
  /* visible value */
  viewValue: string;
}
/* data model for a input form item */
export interface IGenericFormItem {
  /* component type to render */
  type?: IGenericFormItemTypes;
  /* FormControl param */
  formControlName: string;
  /* HTML Input param */
  label?: string;
  /* HTML Input param */
  placeholder?: string;
  /* <mat-hint/> text */
  hint?: string;
  /* Angular [ngClass] */
  ngClass?: any;
  /* angular2-text-mask {mask} param */
  mask?: Array<RegExp | string>;
  /* initial input value */
  value?: any;
  /* date seconds for moment constructor value */
  datepickerTime?: string;
  /* file constrants */
  file?: { size: number; type: RegExp };
  /**
   * max capacity of files in array
   */
  fileArrayLength?: number;
  /**
   * file type value to set on new File() on control type file
   */
  fileTypeValue?: string;
  /**
   * file name value to set on new File() on control type file
   */
  fileNameValue?: string;
  /* temp array with files */
  _files?: Array<File>;
  /* Default input value validator pattern */
  pattern?: RegExp;
  /* Default input value if value isn't preset or pattern fails */
  default?: any;
  /* FormControl validators */
  validators?: ValidatorFn[];
  /* control parameter for async process */
  isLoading?: boolean;
  /* Available options for select|autocomplete inputs */
  options?: Array<IGenericSelect>;
  /* autocomplete filtered options */
  filteredOptions?: Observable<Array<IGenericSelect>>;
  /* autocomplete filtered source */
  url?(any): string;
  /* transform input value before set it in ForControl input item */
  transform?<T = any>(any): T;
  /**
   * transform url() http query response into IGenericSelect autocomplete options
   * @param T: any[]
   * @return IGenericSelect[]
   **/
  sourceTransform?(T: any[]): IGenericSelect[];
  /**
   * callback input
   * @param T: {FormGroup: FormGroup, forms: IGenericFormItem[]}
   **/
  change?(T: IGenericChange);
  /**
   * callback input for datepicker type
   * @param T: {FormGroup: FormGroup, forms: IGenericFormItem[]}
   **/
  dateChange?(T: IGenericChange);
  /**
   * callback input for select|autocomplete type
   * @param T: {FormGroup: FormGroup, forms: IGenericFormItem[]}
   **/
  selectionChange?(T: IGenericChange);
}
/** test if input param is a valid IGenericSelect
 * @returns  Boolean
 * @param o: IGenericSelect | any
 **/
const validSelect = (o: IGenericSelect | any): Boolean =>
  o && o.hasOwnProperty('value');
/** FormControl validator for checkbox|slide-toggle
 * @returns  Boolean
 * @param o: FormControl
 **/
const invalidFile = (o: FormControl): Validators => ({ invalidFile: true });
/** FormControl validator for autocomplete, [o] must to be a valid IGenericSelect value
 * @returns  Boolean
 * @param o: FormControl
 **/
const autocomplete = (o: FormControl): Validators =>
  !validSelect(o.value) ? { autocomplete: true } : null;
/* Validators hint string label map */
export const genericLabels: Map<string, string> = new Map<string, string>([
  ['required', 'Campo requerido'],
  ['min', 'Valor minimo não atingido'],
  ['minLength', 'Tamanho minimo não atingido'],
  ['max', 'Valor máximo últrapassado'],
  ['maxLength', 'Tamanho máximo últrapassado'],
  ['email', 'Não é um e-mail válido'],
  ['requiredTrue', 'Item deve ser marcado'],
  ['autocomplete', 'A opção selecionada não é válida'],
  ['invalidFile', 'Tipo de arquivo inválido ou excede o limite de tamanho'],
  ['fileSize', 'Tamanho do arquivo excede o limite'],
  ['pattern', 'Campo requerido']
]);
/* main exports*/
export const genericValidators = {
    autocomplete,
    invalidFile
  },
  genericFn = {
    validSelect
  };
