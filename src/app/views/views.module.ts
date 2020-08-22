import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkBuilderViewComponent } from './network-builder-view/network-builder-view.component';
import { DataEntryViewComponent } from './data-entry-view/data-entry-view.component';
import { MainViewComponent } from './main-view/main-view.component';

import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [NetworkBuilderViewComponent, DataEntryViewComponent, MainViewComponent],
  imports: [
    CommonModule, AppRoutingModule, ReactiveFormsModule,FormsModule
  ]
})
export class ViewsModule { }
