import { Component, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit(): void {
  }

}
