import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  map: L.Map;
  myRad:any;
  json: any;
  freguesias:Array<L.Layer>=[];
  feature: L.GeoJSON;
  limHigh:number=175;
  limLow:number=80.7;
  limNull:number=60;


  // sjust for test

  constructor(private http:HttpClient) {
  }

  ngOnInit(): void {
    this.http.get('assets/freguesias3.geojson').subscribe((layer: any) => {
      L.geoJSON(layer).getLayers().map((val: L.Layer) => {
        //this.countries.push(val);
        this.freguesias.push(val);
      });
    });
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
    }, 0);

    /*this.http.get('assets/rad.png').subscribe((image:any)=>{
      return image;
    })*/


    this.http.get('assets/freguesias.geojson').subscribe((json: any) => {
      this.json = json;
      this.feature = L.geoJSON(this.json, {
        onEachFeature(feature, layer) {
          return layer.bindPopup(feature.properties.Freguesia);
        },
        style: function filterColor(this: any, feature:any) {
          let x=feature.properties.Freguesia;
          let y=parseFloat(feature.properties.Gamma);

          if(y>1 && y<=this.limNull){
            return {
              color: 'green',
              weight: 1,
              opacity: 1,
              fillOpacity:0.7
            }
          } else if(y>this.limNull && y<this.limLow){
            return{
              color: 'green',
              weight: 1,
              opacity: 1,
              fillOpacity:0.7
            }
          } else if(y>=this.limLow && y<this.limHigh){
            return{
              color: 'yellow',
              weight: 1,
              opacity: 1,
              fillOpacity:0.7
            }
          }else if(y>=this.limHigh) {
            return{
              color: 'red',
              weight: 1,
              opacity: 0.9,
              fillOpacity:0.7
            }
          }else{
            return {
              color: 'blue',
              weight: 2,
              opacity: 0.9,
              fillOpacity:1,
            }
          }

        }.bind(this)
      }).addTo(map);
      map.fitBounds(this.feature.getBounds());
    });

    // map.on('click', <LeafletMouseEvent>(e) => { console.log(e.latlng) });
    this.map = map;
  }





}
