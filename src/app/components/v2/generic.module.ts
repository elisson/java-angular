/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import {LOCALE_ID, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {GenericFormComponent} from './form/form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DateAdapter, MAT_DATE_FORMATS, MatAutocompleteModule,
  MatButtonModule, MatCardModule,
  MatCheckboxModule, MatDatepickerModule, MatIconModule,
  MatInputModule, MatRippleModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatDialogModule,
  MatTabsModule
} from '@angular/material';
import {TextMaskModule} from 'angular2-text-mask';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {GenericHintControlErrorPipe, GenericSecurityTrustHtmlPipe, GenericTranslatePipe} from './pipes';
import { GenericTabDialogComponent } from './dialog/tab.component';
import { GenericDialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    TextMaskModule,
    MatCardModule,
    MatChipsModule,
    MatRippleModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter}
    , { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    , { provide: LOCALE_ID, useValue: 'pt-br' }
    ]
  , declarations: [GenericFormComponent, GenericHintControlErrorPipe,
    GenericSecurityTrustHtmlPipe, GenericTranslatePipe, GenericTabDialogComponent, GenericDialogComponent]
, exports: [GenericFormComponent, GenericTabDialogComponent, GenericDialogComponent]
})
export class GenericModule { }
