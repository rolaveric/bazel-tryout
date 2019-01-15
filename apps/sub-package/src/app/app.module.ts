import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeatureAModule } from './feature-a/feature-a.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FeatureAModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
