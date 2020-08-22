import { Component, OnInit } from '@angular/core';

import { ShapeService } from '../shape.service';
import { ModelElementService } from '../../data-model/model-element.service';
import { Shape } from '../shape';
import { ModelElement } from '../../data-model/model-element'

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  constructor(private shapeService: ShapeService) { }

  shapes: Shape[] = [];
  modelJSON = "";

  ngOnInit(): void {
    this.getShapeData();
  }

  getShapeData() {
    this.shapes = this.shapeService.getShapes();
    var modelData: Array<Object> = [];
    var jString2 = "";
    var jString = "{" + JSON.stringify("bus1") + ":{";
    for (let shape of this.shapes) {
      modelData.push({
        elementId: shape.elementId,
        busId1: (shape.connId1) ? shape.connId1 : "",
        busId2: (shape.connId2) ? shape.connId2 : ""
      });

      jString += JSON.stringify(shape.elementId)
        + ":" + JSON.stringify((shape.connId1) ? shape.connId1 : "") + ","


      jString2 += JSON.stringify({
        elementId: shape.elementId,
        elementType: shape.elementType,
        bus1: shape.connId1,
        bus2: shape.connId2
      });

    }
    jString = jString.substring(0, jString.length - 1) + "}}"

    let myJson = JSON.stringify(modelData);
    console.log("json:" + myJson);

    // this.modelJSON = jString;
    this.modelJSON = jString;

    interface MyObj {
      elementId: string
      bus1: string
    }

    let obj: MyObj[] = JSON.parse(myJson);

    for (let thisObj of obj) {
      console.log("parse:" + thisObj.elementId);
    }


  }
}
