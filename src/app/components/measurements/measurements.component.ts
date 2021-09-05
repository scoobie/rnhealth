import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import SourceVector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import {Coordinates} from "../../models/coordinates";
import {fromLonLat} from "ol/proj";
import {NavigationEnd, Router} from "@angular/router";


@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent implements OnInit {
  //map objects
  map:Map;
  view:View;
  marker:Feature<any>;
  vectorSource:SourceVector<any>;
  coordinates: Coordinates[]=[
    {latitude:41.69242222222222,longitude:-8.828216666666666},
    {latitude:41.5282194444444,longitude:-8.621444444444444},
    {latitude:41.69259444444444,longitude:-8.827852777777778},
    {latitude:41.530575,longitude:-8.620144444444445},
    {latitude:41.529022222222224,longitude:-8.621908333333334},
    {latitude:41.694761111111106,longitude:-8.829677777777778},
    {latitude:41.529444444444444,longitude:-8.619183333333334},
    {latitude:41.530794444444446,longitude:-8.617030555555557},
    {latitude:41.691675,longitude:-8.827933333333332},
    {latitude:41.693466666666666,longitude:-8.827327777777777},
    {latitude:41.69675833333333,longitude:-8.818311111111111},
    {latitude:41.52856111111111,longitude:-8.625569444444444},
    {latitude:41.70503,longitude:-8.82729},
    {latitude:41.696477,longitude:-8.822365},
    {latitude:41.70886,longitude:-8.68235},
    {latitude:41.712403,longitude:-8.739398},
    {latitude:41.736424,longitude:-8.677376},
    {latitude:41.69404,longitude:-8.84368},
    {latitude:41.753248,longitude:-8.786775},
    {latitude:41.72272,longitude:-8.78001},
    {latitude:41.705999,longitude:-8.793587},
    {latitude:41.69387,longitude:-8.84448},
    {latitude:41.70133,longitude:-8.82161},
    {latitude:41.70212,longitude:-8.66397},
    {latitude:41.74017,longitude:-8.73506},
    {latitude:41.775169444444444,longitude:-8.860758333333333},
    {latitude:41.713597222222226,longitude:-8.851725},
    {latitude:41.74926666666667,longitude:-8.86416111111111},
    {latitude:41.736386,longitude:-8.677349},
    {latitude:41.52952777777778,longitude:-8.621963888888889},
    {latitude:41.693279,longitude:-8.840959},
    {latitude:41.699192,longitude:-8.822481},
    {latitude:41.79275,longitude:-8.541722},
    {latitude:41.709074,longitude:-8.80387},
    {latitude:42.031944,longitude:-8.632972},
    {latitude:41.71336,longitude:-8.812562},
    {latitude:41.693416666666664,longitude:-8.83023888888889},
    {latitude:41.50581944444444,longitude:-8.620222222222223},
    {latitude:42.117472,longitude:-8.270583},
    {latitude:41.703306,longitude:-8.820306},
    {latitude:41.697222,longitude:-8.834889},
    {latitude:41.694611,longitude:-8.846944},
    {latitude:41.52945,longitude:-8.621538888888889},
    {latitude:41.524225,longitude:-8.621808333333334},
    {latitude:41.698191666666666,longitude:-8.8265},
    {latitude:41.524255555555555,longitude:-8.624652777777778},
    {latitude:41.710125000000005,longitude:-8.849902777777778},
    {latitude:41.709495,longitude:-8.803784},
    {latitude:41.70226,longitude:-8.82529},
    {latitude:41.691761,longitude:-8.833318},
    {latitude:41.52911388888889,longitude:-8.620391666666666},
    {latitude:41.69286388888889,longitude:-8.82858888888889},
    {latitude:41.529624999999996,longitude:-8.621822222222223},
    {latitude:41.69566111111111,longitude:-8.828863888888888},
    {latitude:41.53091666666666,longitude:-8.619652777777778},
    {latitude:41.530319444444444,longitude:-8.620069444444445}
  ]

  constructor() {
  }


  ngOnInit(): void {
    setTimeout(()=>this.renderMap(),100);

  }

  renderMap(){
    let vectorLayer=new VectorLayer({
      source:new SourceVector(),
      style:new Style(({
        image:new Icon({
          anchor:[0.5,1],
          anchorXUnits:"fraction",
          anchorYUnits:"fraction",
          src:"./assets/marker.png",
          scale:0.05
        })
      }))
    })

    this.map=new Map({
      view:new View({
        center:[-950000,5131000],
        zoom:9.9,
        minZoom:7
      }),
      layers:[
        new TileLayer({
          source:new OSM(),
        }),
      ],
      target:'ol-map'
    });

    this.map.addLayer(vectorLayer);

    for (let i=0;i<this.coordinates.length;i++){
      vectorLayer.getSource().addFeature(this.createMarker(this.coordinates[i].longitude,this.coordinates[i].latitude))
    }

  }

  createMarker(lng:number,lat:number){
    return new Feature({
      geometry:new Point(fromLonLat([lng,lat]))
    });
  }

}
