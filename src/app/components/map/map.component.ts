import {Component, OnDestroy, OnInit} from '@angular/core';
import {faEnvelope,faMapPin,faMap,faLayerGroup,faChartBar,faRadiation,faMountain,faExclamationTriangle,faChevronDown,faLocationArrow} from "@fortawesome/free-solid-svg-icons";
import Map from 'ol/Map';
import SourceVector from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import VectorImage from 'ol/layer/VectorImage'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJson from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import WMS from 'ol/source/TileWMS'
import Group from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import {BaseMapsVisibility} from "../../models/base-maps-visibility";
import {LayersVisibility} from "../../models/layers-visibility";
import {LayersOpacity} from "../../models/layers-opacity";
import {PointMap} from "../../models/point-map";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppToastService} from "../../services/app-toast.service";
import {MapService} from "../../services/map.service";
import {LayersService} from "../../services/layers.service";
import {RestApiService} from "../../services/rest-api.service";
import {BaseMapService} from "../../services/base-map.service";
import {fromLonLat,transform} from "ol/proj";
import { HttpClient } from '@angular/common/http';
import VectorSource from "ol/source/Vector";
import GeoStyle from 'ol/style/Style';
import GeoStroke from 'ol/style/Stroke';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit,OnDestroy {
  // icons
  faEnvelope=faEnvelope;
  faMapPin=faMapPin;
  faMap=faMap;
  faLayer=faLayerGroup;
  faChart=faChartBar;
  faRadiation=faRadiation;
  faMountain=faMountain;
  faDanger=faExclamationTriangle;
  faDown=faChevronDown;
  faLocation=faLocationArrow;


  //map objects
  map:Map;
  view:View;
  marker:Feature<any>;
  vectorSource:SourceVector<any>;

  // Objects
  baseMapVisibility:BaseMapsVisibility;
  layersVisibility:LayersVisibility;
  layersOpacity:LayersOpacity;
  //mapPoint:Point;

  // Attributes to center the Map
  xMap=-891539;
  yMap=4800000;
  initialStatus:boolean=true;
  point:PointMap=new PointMap();

  // Behaviour subject subscriptions
  subscriptionLayerVisibility:Subscription;
  subscriptionLayerOpacity:Subscription;
  subscriptionBaseMapsVisibility:Subscription;
  subscriptionMapPoint:Subscription;

  pixelValue=260;

  // Validation for Coordinates Form
  formCoordinates=new FormGroup({
    "longitude":new FormControl("",[Validators.required,
      Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/),
      Validators.min(-10),
      Validators.max(3)]),
    "latitude":new FormControl("",[Validators.required,
      Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/),
      Validators.min(36),
      Validators.max(44)
    ])
  });

  // Validation for Address Form
  formAddress=new FormGroup({
    address:new FormControl("",[Validators.required,Validators.minLength(5)])
  });

  constructor(public toastService: AppToastService,
              private _baseMapsService:BaseMapService,
              private _mapService:MapService,
              private _layersService:LayersService,
              private _restApiService:RestApiService,
              private http:HttpClient) {

  }

  ngOnInit(): void {
    this.subscriptionMapPoint=this._mapService.pointMap$.subscribe(point=>{
      this.point=point;
    });

    this.baseMapVisibility={satelliteMap:true,openLayers:false,cartoDB:false,stamen:false};
    this.layersVisibility={radiometry:true,shading:false,geology:false,spain:false};
    this.layersOpacity={radiometry:1,shading:0.6,geology:0.7,spain:0.7};
    //this.renderMap();
    //this.setMapPosition(-891539,4800000);
    setTimeout(()=>this.renderMap(),100);
    //this.setMapPosition(-891539,4800000);
  }

  ngOnDestroy(): void {
    this.subscriptionBaseMapsVisibility.unsubscribe();
    this.subscriptionLayerOpacity.unsubscribe();
    this.subscriptionLayerVisibility.unsubscribe();
  }



  renderMap(){
    // Define the view
    this.view= new View({
      zoom:5,
      minZoom:5
    });

    // Map Object
    this.map=new Map({
      view:this.view,
      target:'ol-map'
    })

    // Marker layer
    this.marker=new Feature({geometry:new Point(fromLonLat([0,0]))});
    this.vectorSource=new SourceVector({features:[this.marker]});
    let vectorLayer=new VectorLayer({source:this.vectorSource});

    // Openlayer Map
    let openlayerBaseLayer=new TileLayer({
      source:new OSM()
    })

    // CartoDB Map
    let catoDBBaseLayer= new TileLayer({
      source:new XYZ({
        url:'http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
        attributions:'© CARTO'
      })
    })

    // Stamen Map
    let stamenBaseLayer= new TileLayer({
      source:new XYZ({
        //url:'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
        url:'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
        attributions:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      })
    })

    let satelliteBaseLayer= new TileLayer({
     source:new XYZ({
       //url:'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
       url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
       attributions:['Powered by Esri',
         'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
       attributionsCollapsible:false,
       maxZoom:19
     })
   })

    // Base Layer Group
    const baseLayerGroup=new Group({
      layers:[
        satelliteBaseLayer,openlayerBaseLayer,catoDBBaseLayer,stamenBaseLayer
      ]
    });
    this.map.addLayer(baseLayerGroup);

    // RADIOMETRIC LAYER
    let lnegRadiometricWMSLayer=new TileLayer({
      source:new WMS({
        url:'https://sig.lneg.pt/server/services/CartaRadiometrica/MapServer/WMSServer?',
        params:{
          LAYERS:1,
          FORMAT:'image/png',
          TRANSPARENT:true
        }
      })
    });

    // SHADING LAYER
    let lnegShadingWMSLayer=new TileLayer({
      source:new WMS({
        url:'https://sig.lneg.pt/server/services/CartaRadiometrica/MapServer/WMSServer?',
        params:{
          LAYERS:0,
          FORMAT:'image/png',
          TRANSPARENT:true
        }
      })
    });

    // WMS GEOLOGICAL LAYER
    let lnegGeologicWMSLayer=new TileLayer({
      source:new WMS({
        url:'https://sig.lneg.pt/server/services/CGP500k/MapServer/WMSServer?',
        params:{
          LAYERS:2,
          FORMAT:'image/png',
          TRANSPARENT:true
        }
      })
    });


   let spainWMSLayer = new TileLayer({
      source: new WMS({
        url: 'https://sig.lneg.pt/server/services/MGEP_1M/MapServer/WMSServer?',
        params: {
          LAYERS: 7,
          FORMAT: 'image/png',
          TRANSPARENT: true
        }
      })
    });


    let rasterTileLayerGroup= new Group({
      layers:[spainWMSLayer,lnegRadiometricWMSLayer,lnegShadingWMSLayer,lnegGeologicWMSLayer]
    });
    this.map.addLayer(rasterTileLayerGroup);
    this.map.addLayer(vectorLayer);

    // CLICK ON MAP
    this.map.on('click',evt=>{
      this.showStandard("Point has been selected on the map")
      this.point.pixelValue=0;
      this.point.pixelValPerc=0;
      const clickedPosition=evt.coordinate;
      const x=clickedPosition[0];
      const y=clickedPosition[1];
      var LonLat=transform([x,y],'EPSG:3857','EPSG:4326');
      this.getElavation(LonLat);
      this.getPoint(x,y,LonLat);
      this.initialStatus=false;
      this.showCoords(LonLat);
    })

    // SUBSCRIPTIONS
    // Layers Visibility
    this.subscriptionLayerVisibility=this._layersService.layerVisibility$.subscribe(visibility=>{
      this.layersVisibility=visibility;
      lnegRadiometricWMSLayer.setVisible(visibility.radiometry);
      lnegShadingWMSLayer.setVisible(visibility.shading);
      lnegGeologicWMSLayer.setVisible(visibility.geology);
      spainWMSLayer.setVisible(visibility.spain);
    });
    // Layers Opacity
    this.subscriptionLayerOpacity=this._layersService.layerOpacity$.subscribe(opacity=>{
      this.layersOpacity=opacity;
      lnegRadiometricWMSLayer.setOpacity(opacity.radiometry);
      lnegShadingWMSLayer.setOpacity(opacity.shading);
      lnegGeologicWMSLayer.setOpacity(opacity.geology);
      spainWMSLayer.setOpacity(opacity.spain);
    });
    // Maps Visibility
    this.subscriptionBaseMapsVisibility=this._baseMapsService.baseMapVisibility$.subscribe(visibility=>{
      this.baseMapVisibility=visibility;
      satelliteBaseLayer.setVisible(visibility.satelliteMap);
      openlayerBaseLayer.setVisible(visibility.openLayers);
      catoDBBaseLayer.setVisible(visibility.cartoDB);
      stamenBaseLayer.setVisible(visibility.stamen)
    });

    this.setMapPosition(-891539,4800000)
  }

  // Base Maps Methods
  public onSaveCheckedMap(valueSatellite: boolean,valueOL:boolean,valueCarto:boolean,valueStamen:boolean){
    this.baseMapVisibility.satelliteMap=valueSatellite;
    this.baseMapVisibility.openLayers=valueOL;
    this.baseMapVisibility.cartoDB=valueCarto;
    this.baseMapVisibility.stamen=valueStamen;
    this._baseMapsService.changeBaseMapVisibility(this.baseMapVisibility);
  }

  // Layers Methods
  // Select Radiometric Map
  public onSaveRadiometryCheck(value:boolean){
    this.layersVisibility.radiometry=value;
    this._layersService.changeLayerVisibility(this.layersVisibility);
  }
  // Select Shading Map
  public onSaveShadingCheck(value:boolean){
    this.layersVisibility.shading=value;
    this._layersService.changeLayerVisibility(this.layersVisibility);
  }
  // Select Geologic Map
  public onSaveGeologyCheck(value:boolean){
    this.layersVisibility.spain=false;
    this.layersVisibility.geology=value;
    this._layersService.changeLayerVisibility(this.layersVisibility);
  }
  // Select Spain/Portugal Map
  public onSaveSpainCheck(value:boolean){
    this.layersVisibility.geology=false;
    this.layersVisibility.spain=value;
    this._layersService.changeLayerVisibility(this.layersVisibility);
  }
  // Change Radiometric Opacity
  public onSaveRadiometricOpacity(value:string){
    this.layersOpacity.radiometry=Number(value);
    this._layersService.changeLayerOpacity(this.layersOpacity);
  }
  // Change Shading Opaciy
  public onSaveShadingOpacity(value:string){
    this.layersOpacity.shading=Number(value);
    this._layersService.changeLayerOpacity(this.layersOpacity);
  }
  // Change Geologic Opacity
  public onSaveGeologicOpacity(value:string){
    this.layersOpacity.geology=Number(value);
    this._layersService.changeLayerOpacity(this.layersOpacity);
  }
  // Change Spain/Portugal Geologic opacity
  public onSaveSpainOpacity(value:string){
    this.layersOpacity.spain=Number(value);
    this._layersService.changeLayerOpacity(this.layersOpacity);
  }

  // Retrieve all information for a Point on the Map
  getPoint(x:number,y:number,LonLat:number[]){
    this.getRadiometry(x,y,LonLat);
    this.getGeology(x,y);
    this.getAddress(LonLat[0],LonLat[1]);
    this._mapService.setPoint(this.point);
    // ADD MARKER
    this.setMarker(this.vectorSource,LonLat);
  }

  getElavation(Lonlat:number[]){
    this._restApiService.getElevation(Lonlat[0],Lonlat[1]).subscribe(data=>{
      this.point.elevation=data.results[0].elevation;
    })
  }

  getRadiometry(x:number,y:number,LonLat:number[]){
    this._restApiService.getRadiometry(x,y,x-5,y-5,x+5,y+5).subscribe(data=>{
      this.point.lat=LonLat[0];
      this.point.lon=LonLat[1];
      var pixelValue=data.results[0].attributes['Stretch.Pixel Value'].toString().replace(",",".");
      this.point.pixelValue=pixelValue;
      this.point.pixelValPerc=pixelValue/3.5;
    });
  }

  getGeology(x:number,y:number){
    this._restApiService.getGeology(x,y,x-5,y-5,x+5,y+5).subscribe(data=>{
      this.point.idGeology=data.results[0].attributes['01. Código'];
      this.point.description=data.results[0].attributes['02. Descrição'];
      this.point.descriptionExtended=data.results[0].attributes['03. Descrição1']
    });

  }

  getAddress(lon:number,lat:number){
    this._restApiService.getAddress(lon,lat).subscribe(data=>{
      this.point.address=data.address.LongLabel;
    });
  }

  setMarker(source:SourceVector<any>,xy:number[]){
    source.clear();
    source.addFeature(new Feature({geometry:new Point(fromLonLat([xy[0],xy[1]]))}))
  }

  setMapPosition(x:number, y:number){
    this.map.getView().setCenter([x,y]);
    this.map.getView().setZoom(7);
    let xy=transform([x,y],'EPSG:4326','EPSG:3857');
    this.getPoint(xy[0],xy[1],[x,y]);
    this.initialStatus=false;
  }

  // Get color for Progress bar
  getColor(){
    if(this.point.pixelValue<125) return 'success'
    if(this.point.pixelValue>=125 && this.point.pixelValue<175) return 'warning'
    if(this.point.pixelValue>=175) return 'danger'
    else return 'danger'
  }

  // Search by Coordinates
  onSubmittedCoords(){
    let latitude=parseFloat(this.formCoordinates.value.latitude);
    let longitude=parseFloat(this.formCoordinates.value.longitude);
    let xy=transform([longitude,latitude],'EPSG:4326','EPSG:3857');
    this.getPoint(xy[0],xy[1],[longitude,latitude]);

    this.map.getView().setCenter(xy);
    this.map.getView().setZoom(14);
    this.layersVisibility.radiometry=false;
    this._layersService.changeLayerVisibility(this.layersVisibility);
    this.initialStatus=false;

  }

  // Search Location from address text
  onSubmittedAddress(){
    this._restApiService.getGeocode(this.formAddress.value.address).subscribe(data=>{
      if(data.results[0].geometry.location.lng!=null){
        console.log(data);
        this.showSuccess("Address Found");
        let longitude=data.results[0].geometry.location.lng;
        let latitude=data.results[0].geometry.location.lat;
        let xy=transform([longitude,latitude],'EPSG:4326','EPSG:3857');
        this.getPoint(xy[0],xy[1],[longitude,latitude]);
        this.map.getView().setCenter(xy);
        this.map.getView().setZoom(14);
        this.layersVisibility.radiometry=false;
        this._layersService.changeLayerVisibility(this.layersVisibility);
        this.initialStatus=false;
      }else{
        this.showDanger("Address Not Found")
      }
    })
  }

  showCoords(LonLat:number[]){
    // @ts-ignore
    document.getElementById('lonInput').setAttribute('placeholder',LonLat[0].toString().substring(0,11));
    // @ts-ignore
    document.getElementById('latInput').setAttribute('placeholder',LonLat[1].toString().substring(0,11));

  }

  // ALERTS
  showStandard(message:string) {
    this.toastService.show(message);
  }
  showSuccess(message:string) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 4000 });
  }
  showDanger(message:string) {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 4000 });
  }
  showSimpleAlert(type:string,message:string){
    this.toastService.SimpleAlert(type,message)
  }
}
