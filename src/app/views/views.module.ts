import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkBuilderViewComponent } from './network-builder-view/network-builder-view.component';
import { DataEntryViewComponent } from './data-entry-view/data-entry-view.component';

import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [NetworkBuilderViewComponent, DataEntryViewComponent],
  imports: [
    CommonModule, AppRoutingModule, ReactiveFormsModule
  ]
})
export class ViewsModule { }
