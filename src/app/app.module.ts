import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// import the feature module here so you can add it to the imports array below
import {ViewsModule} from './views/views.module';
import {DataModelModule} from './data-model/data-model.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // add the feature modules here
    ViewsModule,
    DataModelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
