/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { Component, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'brza-table-placeholder',
  templateUrl: './table-placeholder.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TablePlaceholderComponent {
  @Input() labels: string[];
  @Input() avatar: Boolean = false;
}
