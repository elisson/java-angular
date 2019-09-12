/**
 * @author Barbosa, Élisson - elisson@mesistemas.com.br
 * @copyright 2016
 * @description use this wisely
 */
import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';

@Component({
  selector: 'brza-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlaceholderComponent implements OnInit {
  @Input() type: 'avatar' | 'lines' = 'avatar';
  @Input() lines: Number[] = [10, 30, 50];
  @Input() pClass: any;
  height: string;
  ngOnInit() {
    this.height = this.lines[this.lines.length - 1] + 'px';
  }
}
