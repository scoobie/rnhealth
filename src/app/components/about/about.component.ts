import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {faChartBar,faBalanceScaleLeft,faInfo} from "@fortawesome/free-solid-svg-icons";
import {MapPotential} from "../../models/map-potential";
import {Subscription} from "rxjs";
import {MapPotentialService} from "../../services/map-potential.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,OnDestroy {
  faChart=faChartBar;
  faInfo=faInfo;
  faScale=faBalanceScaleLeft;
  map: L.Map;
  myRad:any;
  json: any;
  freguesias:Array<L.Layer>=[];
  feature: L.GeoJSON;
  limHigh:number=80;
  limLow:number=40;
  y:number=100;

  mapPotential:MapPotential;
  subscriptionMapPotential:Subscription;


  constructor(private http:HttpClient,private _potentialService:MapPotentialService) {
  }

  ngOnInit(): void {
    this.http.get('assets/freguesias3.geojson').subscribe((layer: any) => {
      L.geoJSON(layer).getLayers().map((val: L.Layer) => {
        //this.countries.push(val);
        this.freguesias.push(val);
      });
    });
    this.mapPotential={maxValue:true,
      meanValue:false,medianValue:false,tQuartileValue:false,
      lowLimit:40,highLimit:70}

    this.subscriptionMapPotential=this._potentialService.mapPotential$.subscribe(potential=>{
      this.mapPotential=potential;
    })
  }

  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13, attribution: 'OpenStreetMap - "Europe". Downloaded from http://tapiquen-sig.jimdo.com.'
      })/*,
      L.tileLayer.wms('https://sig.lneg.pt/server/services/CartaRadiometrica/MapServer/WMSServer?',{
        layers:'1'
      })*/
    ],
    zoom: 3
  };

  onMapReady(map: L.Map) {
    setTimeout(() => {
      map.invalidateSize();
      this.renderMap(map)
    }, 0);
  }

  renderMap(map:L.Map){
    map.invalidateSize();
    this.http.get('assets/MYDATATEST.geojson').subscribe((json: any) => {
      this.json = json;
      this.feature = L.geoJSON(this.json, {
        onEachFeature(feature, layer) {
          return layer.bindPopup(feature.properties.Freguesia);
        },
        style: function filterColor(this: any, feature:any) {
          let x=feature.properties.Freguesia;

          // select from the geojson which attribute to use
          if(this.mapPotential.tQuartileValue){
              this.y=parseFloat(feature.properties.q3)
            }else if(this.mapPotential.meanValue){
              this.y=parseFloat(feature.properties.mean)
            }else if(this.mapPotential.medianValue){
              this.y=parseFloat(feature.properties.median)
            }else {
              this.y=parseFloat(feature.properties.max)
            }

          //
          //this.y=parseFloat(feature.properties.Gamma);

          if(this.y<=this.mapPotential.lowLimit){
            return {
              color: 'green',
              weight: 1,
              opacity: 0.7,
              fillOpacity:1
            }
          } else if(this.y>=this.mapPotential.lowLimit && this.y<this.mapPotential.highLimit){
            return{
              color: 'yellow',
              weight: 1,
              opacity: 0.7,
              fillOpacity:1
            }
          }else {
            return{
              color: 'red',
              weight: 1,
              opacity: 0.7,
              fillOpacity:1
            }
          }

        }.bind(this)
      }).addTo(map);
      map.fitBounds(this.feature.getBounds());
    });

    // map.on('click', <LeafletMouseEvent>(e) => { console.log(e.latlng) });
    this.map = map;
  }

  ngOnDestroy(): void {
    this.subscriptionMapPotential.unsubscribe();
  }

  public onSaveLowGamma(value:string){
    if(Number(value)+5>this.mapPotential.highLimit){
      this.mapPotential.lowLimit=Number(value);
      this.mapPotential.highLimit=Number(value)+5;
    }else{
      this.mapPotential.lowLimit=Number(value);
    }
    this._potentialService.changeMapPotential(this.mapPotential);
    this.renderMap(this.map)

  }

  public onSaveHighGamma(value:string){
    if(Number(value)-5<this.mapPotential.lowLimit){
      this.mapPotential.highLimit=Number(value);
      this.mapPotential.lowLimit=Number(value)-5;
    }else{
      this.mapPotential.highLimit=Number(value);
    }
    this._potentialService.changeMapPotential(this.mapPotential);
    this.renderMap(this.map)
  }

  public onSaveLimitCheck(valueMax:boolean,valueMean:boolean,valueMedian:boolean,valueQuartile:boolean){
   /* if(valueMax){
      this.y=30;
    }else if(valueMean){
      this.y=70;
    }else if(valueMedian){
      this.y=100;
    }else {
      this.y=150;
    }*/
    this.mapPotential.maxValue=valueMax;
    this.mapPotential.meanValue=valueMean;
    this.mapPotential.medianValue=valueMedian;
    this.mapPotential.tQuartileValue=valueQuartile;
    this._potentialService.changeMapPotential(this.mapPotential);
    this.renderMap(this.map)
  }







}
