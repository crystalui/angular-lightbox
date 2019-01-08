import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CrystalLightboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
