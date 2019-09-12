/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablePlaceholderComponent } from './table-placeholder.component';
import { PlaceholderModule } from '../placeholder/placeholder.module';

@NgModule({
  declarations: [TablePlaceholderComponent],
  exports: [TablePlaceholderComponent],
  imports: [
    CommonModule,
    PlaceholderModule
  ]
})
export class TablePlaceholderModule { }
