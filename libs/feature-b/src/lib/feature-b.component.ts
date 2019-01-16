import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-feature-b',
  template: `
    <p>feature-b works!</p>
  `,
  styles: []
})
export class FeatureBComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
