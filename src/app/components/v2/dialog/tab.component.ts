/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { OnInit, AfterViewInit, ViewChild, Inject, ViewEncapsulation, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IGenericFormItem } from '../validators';

export interface IGenericInputTab {
  input?: IGenericFormItem[];
  invalid?(T: { message: string, mimePattern: string, file: File }): void;
  save?(T: { message: string, mimePattern: string, file: File }): void;
}

@Component({
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tab.component.html'
})
export class GenericTabDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup', { static: true }) tabGroup;
  public buttons: any; // = [<any>{ ngClass: 'btn btn-blue pd-h-8', label: 'Salvar', disabled: true }];
  constructor(
    public dialogRef: MatDialogRef<GenericTabDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buttons = data.buttons || [<any>{ label: 'tab.save', disabled: true }];
   }

  ngAfterViewInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.dialogRef.close(false));
    this.dialogRef.keydownEvents().subscribe(e => e.keyCode === 27 && this.dialogRef.close(false));
  }

  ngOnInit() {
    if (this.data.tabs.length < 2) {
      this.hideTabs();
      if (!this.data.tabs[0].save) {
        this.buttons = null;
      }
    }
    this.data.tabs = this.data.tabs.map((tab, index) => {
      tab.disable = () => tab.disabled = true;
      tab.enable = () => tab.disabled = false;
      tab.active = () => this.tabGroup.selectedIndex = index;
      return tab;
    });
  }

  tabs = (index?: number) => !isNaN(index) ? this.data.tabs[index] : this.data.tabs;
  /** find and hide tabs in current form input
   * @returns  void
   * */
  private readonly hideTabs = () => {
    const tabs = document.querySelector('mat-tab-group.generic-input-component > mat-tab-header');
    if (tabs) { tabs.classList.add('invisible'); }
  }

  change = (_genericFormComponent: any, { statusChanges }: any) => {
    this.buttons[0].click = () => _genericFormComponent._submit();
    statusChanges.subscribe( (status: any) => { this.buttons[0].disabled = (status === 'INVALID'); });
  }

  save = (tabEvent: Function, formEvent) =>
    tabEvent && typeof tabEvent === 'function' && this._run(tabEvent, formEvent)

  _run = (run: Function, evt: any) => run(evt, this.dialogRef);

}
