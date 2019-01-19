import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { messageReducer } from './+state/reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ message: messageReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
