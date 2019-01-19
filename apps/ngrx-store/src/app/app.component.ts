import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from './+state/interface';
import { getMessage } from './+state/selectors';
import { setMessage } from './+state/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ngrx-store';

  message: Observable<string> = this.store.pipe(select(getMessage));

  constructor(private store: Store<State>) {}

  setMessage(message: string) {
    this.store.dispatch(setMessage(message));
  }
}
