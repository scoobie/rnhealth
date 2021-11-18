import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {
  map: L.Map;
  myRad:any;
  json: any;
  freguesias:Array<L.Layer>=[];
  feature: L.GeoJSON;
  limHigh:number=272.3;
  limLow:number=80.7;
  limNull:number=60;
  constructor() {
  }

  ngAfterViewInit(): void {
  }





}
