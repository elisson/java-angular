/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  styleUrls:  [`./dialog.component.css`],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog.component.html'
  , selector: 'app-generic-dialog'
})
export class GenericDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
