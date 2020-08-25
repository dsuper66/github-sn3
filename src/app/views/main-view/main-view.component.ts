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

  constructor(
    private shapeService: ShapeService,
    private modelElementService: ModelElementService) 
    { }

  shapes: Shape[] = [];
  modelJSON = "";

  ngOnInit(): void {
    this.getModelData();
  }

  getModelData() {
    //Start element and array of elements
    var jString = "{" + JSON.stringify("elements") + ":[";
    let modelElements = this.modelElementService.getModelElements();
    for (const modelElement of modelElements){
      //ID
      jString += "{" + JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
      //Element type
      jString += JSON.stringify("elementTypeId") + ":" + JSON.stringify(modelElement.elementTypeId) + ",";
      //Properties
      jString += JSON.stringify("properties") + ":[";
  
      //Properties
      for (const propertyTypeId
          of this.modelElementService.getPropertyTypeIdsOfElementType(modelElement.elementTypeId)) {

            let value = this.modelElementService.getValueForElementProperty(modelElement.elementId,propertyTypeId);
            jString += "{" + JSON.stringify(propertyTypeId)  + ":" + JSON.stringify(value)  + "},"
      }
      //Close properties array and element to prep for next element
      jString = jString.substring(0, jString.length - 1) + "]},";
    }
    //Close elements array and element
    jString = jString.substring(0, jString.length - 1) + "]}";

    this.modelJSON = jString;
  }


  getModelDataOld() {
    this.shapes = this.shapeService.getShapes();
    var modelData: Array<Object> = [];
    // var jString2 = "";
    var jString = "{" + JSON.stringify("bus1") + ":{";

    for (let shape of this.shapes) {
      modelData.push({
        elementId: shape.elementId,
        busId1: (shape.connId1) ? shape.connId1 : "",
        busId2: (shape.connId2) ? shape.connId2 : ""
      });

      jString += JSON.stringify(shape.elementId)
        + ":" + JSON.stringify((shape.connId1) ? shape.connId1 : "") + ","


      // jString2 += JSON.stringify({
      //   elementId: shape.elementId,
      //   elementType: shape.elementType,
      //   bus1: shape.connId1,
      //   bus2: shape.connId2
      // });

    }
    jString = jString.substring(0, jString.length - 1) + "}}"

    this.modelJSON = jString;

    // let myJson = JSON.stringify(modelData);
    // console.log("json:" + myJson);
    // interface MyObj {
    //   elementId: string
    //   bus1: string
    // }

    // let obj: MyObj[] = JSON.parse(myJson);

    // for (let thisObj of obj) {
    //   console.log("parse:" + thisObj.elementId);
    // }


  }
}
