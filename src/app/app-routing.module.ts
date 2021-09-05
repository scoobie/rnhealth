import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MeasurementsComponent} from "./components/measurements/measurements.component";
import {MapComponent} from "./components/map/map.component";
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {AboutComponent} from "./components/about/about.component";

const routes: Routes = [
  {path:'',component:MapComponent},
  {path:'measurements',component:MeasurementsComponent},
  {path:'statistics',component:StatisticsComponent},
  {path:'about',component:AboutComponent},
  {path:'**',component:MapComponent,pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
