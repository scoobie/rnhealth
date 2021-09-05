import { Injectable } from '@angular/core';
import {BaseMapsVisibility} from "../models/base-maps-visibility";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BaseMapService {
  baseMapVisibility:BaseMapsVisibility=new BaseMapsVisibility();
  //Behaviour subjects
  private _baseMapVisibilitySource=new BehaviorSubject(this.baseMapVisibility);

  //Observable
  baseMapVisibility$=this._baseMapVisibilitySource.asObservable();

  //service commands
  changeBaseMapVisibility(value:BaseMapsVisibility){
    this._baseMapVisibilitySource.next(value);
  }

  constructor() { }
}
