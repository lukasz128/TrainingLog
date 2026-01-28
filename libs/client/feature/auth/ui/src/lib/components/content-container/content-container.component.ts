import { NgOptimizedImage } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'auth-content-container',
  imports: [NgOptimizedImage],
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'auth-content-container',
  },
})
export class ContentContainerComponent {}
