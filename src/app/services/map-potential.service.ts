import { Injectable } from '@angular/core';
import {MapPotential} from "../models/map-potential";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapPotentialService {
  mapPotential:MapPotential=new MapPotential();

  private _mapPotentialSource=new BehaviorSubject(this.mapPotential);

  //Observable
  mapPotential$=this._mapPotentialSource.asObservable();

  //service commands
  changeMapPotential(value:MapPotential){
    this._mapPotentialSource.next(value);
  }

  constructor() { }
}
