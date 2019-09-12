import { Component, OnInit } from '@angular/core';
import { FILES } from './components/v2/helpers';
import { IGenericFormItem } from './components/v2/validators';
import { Validators } from '@angular/forms';
import { GenericTabDialogComponent } from './components/v2/dialog/tab.component';
import { GenericDialogComponent } from './components/v2/dialog/dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'brza-elisson';
  public forms: IGenericFormItem[] = [
    {
      formControlName: 'a'
      , value: 'xpto'
      , label: 'generic.error.400'
      , validators: [Validators.required, Validators.maxLength(2), Validators.minLength(1)]
    }
  ];
}
