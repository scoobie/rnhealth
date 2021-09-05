import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable,throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
// Geoportal URLs
  radiometryURL="https://sig.lneg.pt/server/rest/services/CartaRadiometrica/MapServer/identify";
  geologyURL="https://sig.lneg.pt/server/rest/services/CGP500k/MapServer/identify";
  addressURL="https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode";
  googleURl="https://maps.googleapis.com/maps/api/geocode/json";
  elevationURL="https://api.open-elevation.com/api/v1/lookup";
  APIKEY="AIzaSyBhpME8DXkR08-Pk84hprnuOFIOCB0-bIg";

  constructor(private http:HttpClient) {
  }

  // Get Radiometric value
  getRadiometry(x:number,y:number,xinf:number,yinf:number,xsup:number,ysup:number):Observable<any>{
    let params=new HttpParams();
    params=params.append('f','json');
    params=params.append('returnField','false');
    params=params.append('returnGeometry','false');
    params=params.append('returnUnformattedValues','false');
    params=params.append('returnZ','false');
    params=params.append('tolerance','3');
    params=params.append('imageDisplay','978,579,96');
    params=params.append('geometry','{"x":'+x+',"y":'+y+'}');
    params=params.append('geometryType','esriGeometryPoint');
    params=params.append('sr','102100');
    params=params.append('mapExtent',xinf+','+yinf+','+xsup+','+ysup);
    params=params.append('layers','visible');

    return this.http.get<any>(this.radiometryURL,{params:params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // Get Radiometric value
  getGeology(x:number,y:number,xinf:number,yinf:number,xsup:number,ysup:number):Observable<any>{
    let params=new HttpParams();
    params=params.append('f','json');
    params=params.append('returnField','false');
    params=params.append('returnGeometry','false');
    params=params.append('returnUnformattedValues','false');
    params=params.append('returnZ','false');
    params=params.append('tolerance','3');
    params=params.append('imageDisplay','978,579,96');
    params=params.append('geometry','{"x":'+x+',"y":'+y+'}');
    params=params.append('geometryType','esriGeometryPoint');
    params=params.append('sr','102100');
    params=params.append('mapExtent',xinf+','+yinf+','+xsup+','+ysup);
    params=params.append('layers','visible');

    return this.http.get<any>(this.geologyURL,{params:params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getGeocode(address:string):Observable<any>{
    let params=new HttpParams();
    params=params.append('address',address);
    params=params.append('key',this.APIKEY);
    return this.http.get(this.googleURl,{params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getElevation(lon:number,lat:number):Observable<any>{
    let params=new HttpParams();
    params=params.append('locations',lat+','+lon);
    return this.http.get(this.elevationURL,{params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getAddress(x:number,y:number):Observable<any>{
    let params=new HttpParams();
    params=params.append('f','json');
    params=params.append('featureTypes','');
    params=params.append('location',x+','+y);
    params=params.append('wkid','4326');

    return this.http.get<any>(this.addressURL,{params:params})
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  handleError(error:any){
    let errorMessage='';
    if(error.error instanceof  ErrorEvent){
      errorMessage=error.error.message;
    }else{
      errorMessage=`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
