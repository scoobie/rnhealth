import { Injectable } from '@angular/core';
import {LayersVisibility} from "../models/layers-visibility";
import {BehaviorSubject} from "rxjs";
import {LayersOpacity} from "../models/layers-opacity";

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  layerVisibility:LayersVisibility=new LayersVisibility();
  layerOpacity:LayersOpacity=new LayersOpacity();

  //Behaviour subjects
  private _visibilityLayerSource=new BehaviorSubject(this.layerVisibility);
  private _opacityLayerSource=new BehaviorSubject(this.layerOpacity);

  //Observables
  layerVisibility$=this._visibilityLayerSource.asObservable();
  layerOpacity$=this._opacityLayerSource.asObservable();

  // Service commands
  changeLayerVisibility(value:LayersVisibility){
    this._visibilityLayerSource.next(value);
  }

  changeLayerOpacity(value:LayersOpacity){
    this._opacityLayerSource.next(value);
  }

  constructor() { }
}
