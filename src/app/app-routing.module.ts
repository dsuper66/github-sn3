import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Import the components that we are going to route to
import { NetworkBuilderViewComponent } from './views/network-builder-view/network-builder-view.component';
import { DataEntryViewComponent } from './views/data-entry-view/data-entry-view.component';

const routes: Routes = [
  //When first opened, no path re-directs to this path...
  { path: '', redirectTo: '/network-builder-component', pathMatch: 'full' },
  //The paths that link to the components
  {path: 'data-entry-component', component: DataEntryViewComponent},
  {path: 'network-builder-component', component: NetworkBuilderViewComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
