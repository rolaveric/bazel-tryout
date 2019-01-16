import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FeatureBModule } from 'bazel_tryout/libs/feature-b/src';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FeatureBModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
