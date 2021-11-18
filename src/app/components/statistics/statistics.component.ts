import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../../services/rest-api.service";
import {transform} from "ol/proj";
import {Class} from "leaflet";
import {Mesure} from "../../models/Mesure";
import {delay} from "rxjs/operators";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})


export class StatisticsComponent implements OnInit {

  value1 = 65;
  value2=35;
  value3=3;
  value4=62;
  value5=38;
  value6=6;
  gaugeAppendText = "%";
  color1="#009900";
  color2="#ff9900"
  color3="#ff3300"
  label1="Buildings";
  label2="Measurements"
  boxSize=140;

  xinf=-1057600.28
  yinf=4433489.72;
  xdelta=650;
  ydelta=658;
  corX=0;
  corY=0;
  info:any=[];



  constructor( private _restApiService:RestApiService,) { }

  ngOnInit(): void {
  }

  getRadon(){
    var counter = 0;

    for (let i=0;i<580;i++){
      this.corX=this.xinf+this.xdelta*i;

      for (let j=550;j<600;j++){
        this.corY=this.yinf+this.ydelta*j;

        //setTimeout(=>{}, ++counter * 500);
        setTimeout(() =>{
          this.getRadiometry(this.corX,this.corY,i*10000+j);
        },++counter*20);
        //this.getRadiometry(this.corX,this.corY,i*10000+j);

      }
    }
    console.log(this.info);
  }


  getRadiometry(x:number,y:number,id:number){
    this._restApiService.getRadiometry(x,y,x-5,y-5,x+5,y+5).subscribe(data=>{
      var LonLat=transform([x,y],'EPSG:3857','EPSG:4326');


      if(data.results.length>0 && data.results[0].attributes['Stretch.Pixel Value']!='NoData'){

        let costumObj=new Mesure(id,LonLat,data.results[0].attributes['Stretch.Pixel Value']);
        //console.log(costumObj);
        this.info.push(costumObj);
        //let myInf=new Mesure();
        //myInf.LonLat=LonLat;
        //myInf.pixel=data.results[0].attributes['Stretch.Pixel Value'];//.toString().replace(",",".")
        //console.log(myInf);
        //this.info.push(myInf);
        //console.log(this.info);
        //console.log(data.results[0].attributes['Stretch.Pixel Value'].toString().replace(",",".")+ 'Lon: '+LonLat[0]+' Lat: '+LonLat[1])
      }
    });
  }

}
