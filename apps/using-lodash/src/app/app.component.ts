import { Component } from '@angular/core';
import { camelCase } from 'lodash-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = camelCase('using-lodash');
}
