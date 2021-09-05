import { Injectable } from '@angular/core';
import {PointMap} from "../models/point-map";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  point=new PointMap();
  // Behaviour subject
  private _pointItemSource=new BehaviorSubject(this.point);

  // Observable
  pointMap$=this._pointItemSource.asObservable();

  constructor() { }

  setPoint(value:PointMap){
    this._pointItemSource.next(value);
  }
}
