/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { genericFn, genericValidators, IGenericFormItem, IGenericSelect, IGenericButton } from '../validators';
import { momentDateFromString, base64ToBytes, REG_EXP } from '../helpers';

/* default input file filters : any type, file size aprox.2mb */
const DEFAULT_FILE_FILTERS = { type: /^./, size: 2097152 };

@Component({
  selector: 'app-generic-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GenericFormComponent implements OnInit {
  /* show the form*/
  public draw: boolean;
  /* default form*/
  protected formGroup: FormGroup;
  @Input() lang: String = 'pt';
  /* FormGroup config param validatorOrOpts */
  @Input() validatorOrOpts: ValidatorFn | ValidatorFn[] | AbstractControlOptions;
  /* FormGroup config param asyncValidator */
  @Input() asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[];
  /* show action buttons*/
  @Input() buttons: IGenericButton[] = <IGenericButton[]>[{ label: 'Salvar', type: 'submit' }];
  /* itens in form*/
  @Input() forms: IGenericFormItem[];
  /* ngClass param for form element */
  @Input() formClass: any = 'mg-t-35';

  @Input() actionClass: any = 'flex';
  // mat-form-field appearance
  @Input() appearance: any = 'outline';
  /* bind queryParams to form */
  @Input() fromRoute: boolean;
  /* form submit event */
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  /* form status emitter */
  @Output() statusChanges: EventEmitter<any> = new EventEmitter<Observable<any>>();

  constructor(
    private activatedRoute: ActivatedRoute
    , private http: HttpClient
  ) { }
  /**
   * @description run the events
   * @param run: function
   * */
  _run = run => typeof run === 'function' && run({ FormGroup: this.formGroup, forms: this.forms });
  /**
   * @description datepicker's trigger event
   * @param item: object
   * */
  dateChange = (item: IGenericFormItem) => this._run(item.dateChange);
  /**
   * @description input's trigger event
   * @param item: object
   * */
  change = (item: IGenericFormItem) => this._run(item.change);
  /**
   * @description file event
   * @param file: HTMLInputElement
   * */
  selectFile = (file: HTMLInputElement, item: IGenericFormItem) => {
    if (isNaN(item.fileArrayLength) || (item._files || []).length < item.fileArrayLength) {
      file.addEventListener('change', this._HTMLInputElementChange);
      file.click();
    }
  }
  /**
  * @description filter invalid files
  * @param files: File[]
  * @param item: IGenericFormItem // typeof item.change === 'function'? item.change :
  * @returns Array<File>
  */
  filterFile = (files: File[], item: IGenericFormItem) => {
    /*default filter params*/
    item.file = { ...DEFAULT_FILE_FILTERS, ...item.file };
    return Array.from(files)
      .filter((f: File) => f.size <= item.file.size && item.file.type.test(f.type));
  }
  /**
  * @description filter invalid files
  * @param files: File[]
  * @param item: IGenericFormItem
  */
  removeFile = (item: IGenericFormItem, index: number, file: HTMLInputElement) => {
    item._files.splice(index, 1);
    if (item._files.length < 1) {
      file.value = '';
      const control = this.formGroup.get(item.formControlName);
      control.reset();
      this._setControlValidators(control, [...(item.validators || [])]);
    }
    this.change.call(this, item);
  }
  private _setControlValidators = (control: AbstractControl, validators: ValidatorFn[]) => {
    control.clearValidators();
    control.setValidators(validators);
    control.updateValueAndValidity();
    control.markAsTouched();
  }
  /**
   * @description push a File into item array
   * @param target: Event
   * @returns void
   * */
  private _HTMLInputElementChange = ({ target }) => {
    target.removeEventListener('change', this._HTMLInputElementChange);
    const name = target.getAttribute('name'),
      item = this.forms.find(i => i.formControlName === name),
      control = this.formGroup.get(name),
      files = this.filterFile(target.files, item);

    if (!target.files || (control.invalid && control.touched && item._files && item._files.length)) { return; }

    if (files.length) {
      this._setVirtualFilesAndControl(control, item, files);
    } else {
      this._resetVirtualFilesAndControl(control, item);
    }
    this.change.call(this, item);
  }

  private _resetVirtualFilesAndControl = (
    control: AbstractControl
    , item: IGenericFormItem): void => {
    control.reset();
    this._setControlValidators(control, [genericValidators.invalidFile]);
    item._files = [];
  }

  private _setVirtualFilesAndControl = (
    control: AbstractControl
    , item: IGenericFormItem, files: File[]): void => {
    this._setControlValidators(control, [...(item.validators || [])]);
    if (item._files) {
      item._files.unshift(...files as File[]);
    } else {
      item._files = <File[]>[...files];
    }
    control.setValue(item._files);
  }

  trySetInputFiles = (item: IGenericFormItem): void => {
    try { console.log('debug');
      const file = item.value;
      const control = this.formGroup.get(item.formControlName);
      if ( file instanceof File ) {
        this._setVirtualFilesAndControl(control, item, [file]);
      } else if (file) {
        base64ToBytes(file).subscribe((bytes: any) => {
          const fileResult = new File([bytes], item.fileNameValue || 'file'
          , { type: item.fileTypeValue || 'text/plain' });
          this._setVirtualFilesAndControl(control, item, [fileResult]);
        });
      }
    } catch (e) { console.log(e); }
  }
  /**
   * @description (select|autocomplete)'s trigger event
   * @param item: object
   * */
  selectionChange = (item: IGenericFormItem) => this._run(item.selectionChange);
  /**
   * @description the input error object
   * @returns  object
   * @param name: string
   * */
  getError = (name: string) => this.formGroup.get(name).errors;
  /**
   * @description visible value to autocomplete component input value
   * @returns  o: string
   * @param o: object
   * */
  displayWith = (o: IGenericSelect) => o && (o.viewValue || o.value);
  /**
   * @description submitting event trigger
   * @param $event: Event
   * */
  _submit = () => this.save.emit(this.formGroup.value);
  /**
   * @description show error if it exists
   * @returns  Boolean
   * @param item: object
   * */
  showError = (item: IGenericFormItem) => {
    const control = this.formGroup.get(item.formControlName);
    return control.invalid && (control.touched || this.formGroup.dirty);
  }
  /**
   * @description search for a item in input options
   * @returns  opt: Array<any>
   * @param opt: Array<any>
   * @param val: String
   * */
  private _filter = (opt: Array<IGenericSelect>, val: string)
    : Array<IGenericSelect> => (!val || genericFn.validSelect(val)) ?
      opt : opt.filter(item => (item.viewValue || item.value).toLowerCase().includes(val.toLowerCase()))
  /**
   * @description test a item for a valid value
   * @returns  any
   * @param item: object
   * */
  valueOrEmpty = (item: IGenericFormItem) => item.value !== undefined ? item.value : item.default !== undefined ? item.default : '';
  /**
   * @description search for a item in input options
   * @returns  any
   * @param item: object
   * */
  transformOrEmpty = (item: IGenericFormItem) => typeof item.transform === 'function' ?
    item.transform(this.valueOrEmpty(item)) : this.valueOrEmpty(item)
  /**
   * @description search for a item by http request
   * @param valueChanges: Observable
   * @param input: object
   * */
  fromSource = ({ valueChanges }: any, input: IGenericFormItem) => {
    let lastValue: any;
    valueChanges.subscribe( (val: any) => {
      lastValue = val;
      if (!input.isLoading && typeof val === 'string' && val.length > 1) {
        input.isLoading = true;
        doQuery(val);
      }
    });
    const doQuery = (val: any) => {
      this.http.get(input.url(val)).subscribe((res: Array<any>) => {
        if (val !== lastValue) {
          doQuery(lastValue);
        } else {
          const filteredOptions = typeof input.sourceTransform === 'function' ? input.sourceTransform(res) : res;
          input.filteredOptions = Observable.create( (o: any) => o.next(filteredOptions));
          input.isLoading = false;
        }
      }, e => { console.error(e); input.isLoading = false; });
    };
  }

  private readonly _transformKnowningTypes = <T = any>(item: IGenericFormItem) => {
    switch (item.type) {
      case 'checkbox':
      case 'slide-toggle':
        return REG_EXP.BOOLEAN.test(this.transformOrEmpty(item)) === true;
      case 'datepicker':
        return momentDateFromString(this.transformOrEmpty(item), item.datepickerTime);
      case 'autocomplete':
        const value = (this.transformOrEmpty(item) || {}).value;
        return item.options.find(o => o.value === value);
      default:
        return this.transformOrEmpty(item);
    }
  }
  /**
   * @description hydrating the form
   * @param cb: Function | any
   * @returns void
   * */
  hydrate = (cb: any) => {
    this.forms.map( (i: IGenericFormItem) => {
      const isAuto = /^autocomplete$/.test(i.type),
        validators = isAuto && i.validators ? <Array<ValidatorFn>>[...i.validators, genericValidators.autocomplete] : i.validators || null,
        control = new FormControl(this._transformKnowningTypes(i), validators);
      if (isAuto) {
        if (typeof i.url === 'function') {
          this.fromSource(control, i);
        } else {
          i.filteredOptions = control.valueChanges.pipe(
            startWith(''),
            map(val => this._filter(i.options, val))
          );
        }
      }
      this.formGroup.addControl(i.formControlName, control);
      if (i.type === 'file') {
        this.trySetInputFiles(i);
      }
    }
    );
    cb();
  }
  /**
   * @description hydrating the form from query params
   * @returns void
   * */
  hydrateFromRoute = () => {
    this.activatedRoute.queryParams.subscribe(q => {
      Object.keys(q || {}).map(_q => {
        const input = this.forms.find(i => i.formControlName === _q);
        if (!input) { return; }
        const control = this.formGroup.get(_q);
        if (!control) { return; }
        const value = q[_q] !== 'undefined' ? q[_q] : undefined,
          pass = input.pattern ? new RegExp(input.pattern).test(value) : true;
        if (input.validators) {
          control.clearValidators();
          control.setValidators(input.validators);
          control.updateValueAndValidity();
        }
        if (/^autocomplete$/.test(input.type)) {
          if (typeof input.url === 'function') {
            this.fillAutocompleteFromHttpResource(value, input, control);
          } else {
            control.setValue(input.options.find(o => o.viewValue === value));
          }
        } else if (input.type !== 'file') {
          control.setValue(pass ? this._transformKnowningTypes({ ...input, value }) : '');
        } else {
          this.trySetInputFiles(input);
        }
      });
    });
  }
  /**
   * @description fill autocomplete from query http resource
   * @param val: string
   * @param input: IGenericFormItem
   * @param control: AbstractControl
   * @returns void
   * */
  fillAutocompleteFromHttpResource = (val: string, input: IGenericFormItem, control: AbstractControl) => {
    input.isLoading = true;
    this.http.get(input.url(val)).subscribe((res: Array<any>) => {
      input.options = typeof input.sourceTransform === 'function' ? input.sourceTransform(res) : res;
      control.setValue(input.options.find(o => o.viewValue === val));
      input.isLoading = false;
    }, e => { console.error(e); input.isLoading = false; });
  }
  ngOnInit() {
    if (this.forms) {
      this.formGroup = new FormGroup({}, this.validatorOrOpts, this.asyncValidator);
      this.hydrate(() => {
        if (this.fromRoute) {
          this.hydrateFromRoute();
        }
        this.draw = true;
        const { statusChanges, valueChanges } = this.formGroup;
        this.statusChanges.emit({ statusChanges, valueChanges });
      });
    }
  }
}
