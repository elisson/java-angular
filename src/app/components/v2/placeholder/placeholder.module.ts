/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderComponent } from './placeholder.component';

@NgModule({
  declarations: [PlaceholderComponent],
  exports: [PlaceholderComponent],
  imports: [
    CommonModule
  ]
})
export class PlaceholderModule { }
