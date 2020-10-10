import { Injectable } from '@angular/core';
import { Shape } from './shape';
import { ModelElementService } from '../data-model/model-element.service'
import { ModelElementDataService } from '../data-model/model-element-data.service'

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(
    private modelElementService: ModelElementService,
    private modelElementDataService: ModelElementDataService
  ) { }

  private shapes: Shape[] = [];

  //Initial values
  branchInitLength = 100;
  busInitX = 50;
  busInitY = 100;
  busInitLength = 120;

  //Standard values
  branchWidth = 5;
  busWidth = 14;
  genLoadLength = 42;
  genLoadWidth = 30;

  //Selection box
  selectWidth = 40;



  //Selected shape... ONLY used so that we can define the selected shape 
  //when returning from another display
  private selectedShapeId?: string;
  setSelectedShapeId(selectedShapeId: string | undefined) {
    this.selectedShapeId = selectedShapeId;
  }
  getSelectedShape(): Shape | undefined {
    if (this.selectedShapeId != undefined) {
      return this.getShapeWithId(this.selectedShapeId);
    }
    else {
      return undefined;
    }
  }

  //Delete
  deleteShape(elementId: string) {
    this.shapes = this.shapes.filter(
      shape => shape.elementId != elementId);
    this.modelElementDataService.deleteElement(elementId)
  }

  //Get shapes
  getShapes() {
    console.log("get shapes");
    return this.shapes;
  }
  getShapeWithId(elementId: string): Shape | undefined {
    return this.shapes.filter(shape => shape.elementId === elementId)[0];
  }
  //Shapes of type
  //***this happens multiple times during a move *****/
  getShapesOfType(elementType: string): Shape[] {
    let filtered = this.shapes.filter(shape => shape.elementType === elementType);
    // for (let element of filtered) {
    //   console.log("shapes of type:" + elementType + " = " + element.elementId);
    // }
    return filtered;
  }
  //...and not of type
  getShapesNotOfType(elementType: string): Shape[] {
    return this.shapes.filter(shape => shape.elementType != elementType);
  }
  getCountShapesOfType(elementType: string) {
    return this.getShapesOfType(elementType).length;
    //return this.shapes.filter(shape => shape.elementType === elementType).length;
  }

  //Add a shape
  addShape(elementType: string): Shape {
    //Add the element and get back the i.d.
    let newElementId = this.modelElementService.addModelElement(elementType);

    //For deciding placement
    //let count = this.shapes.filter(shape => shape.elementType === elementType).length;
    console.log(newElementId + ":" + elementType + " count:" + (this.getCountShapesOfType(elementType) + 1));

    var newShape = new Shape;
    //BUS
    if (elementType == 'bus') {
      let y = this.busInitY * (1 + this.getCountShapesOfType('bus'));
      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: this.busInitX,
        yInner: y,
        wInner: this.busInitLength,
        hInner: this.busWidth,
        xOuter: this.busInitX,
        yOuter: y - (this.selectWidth - this.busWidth) / 2,
        wOuter: this.busInitLength,
        hOuter: this.selectWidth
      })
      console.log(">>>" + (this.busInitX) + " " + (y + this.busWidth / 2))
    }
    //BRANCH
    else if (elementType == 'branch') {
      let branchCountNew = this.getCountShapesOfType('branch') + 1;
      var x = 0;
      if (branchCountNew % 2 == 1) {
        x = this.busInitX + 0.2 * this.busInitLength;
      }
      else {
        x = this.busInitX + 0.8 * this.busInitLength - this.branchWidth
      };
      let y = (this.busInitY * Math.ceil(branchCountNew / 2)) + this.busWidth / 2;
      // this.shapes.push({
      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: x,
        yInner: y,
        wInner: this.branchWidth,
        hInner: this.branchInitLength,
        xOuter: x - (this.selectWidth - this.branchWidth) / 2,
        yOuter: y,
        wOuter: this.selectWidth,
        hOuter: this.branchInitLength
      })
    }
    //GEN & LOAD
    else if (elementType == 'gen' || elementType == 'load') {
      let genLoadCount = this.getCountShapesOfType('gen') + this.getCountShapesOfType('load')
      let h = this.genLoadLength;
      let w = this.genLoadWidth;
      let x = this.busInitX + this.busInitLength / 2 - w / 2;
      let y = (this.busInitY * (1 + genLoadCount)) - h;
      var path1: string | undefined;
      var path2: string | undefined;

      if (elementType == 'gen') {
        let sineStartX = 6;
        let sineStartY = w / 2;
        let sineW = w - 2 * sineStartX;
        path1 = `M ${sineStartX} ${sineStartY}           q ${sineW / 4} ${-sineW / 2} ${sineW / 2} 0`
        path2 = `M ${sineStartX + sineW / 2} ${sineStartY} q ${sineW / 4} ${sineW / 2}  ${sineW / 2} 0`
      }
      else if (elementType == 'load') {
        let arrowH = 10;
        //<path id="lineAB" d="M 20 100 l 0 -98 m -18 18 l 18 -18 l 18 18"
        path1 = `M ${w / 2} ${h} l 0 ${-(h - 2)} m ${-arrowH} ${arrowH} l ${arrowH} ${-arrowH} l ${arrowH} ${arrowH}`
      }

      console.log("path1: " + path1 + " path2: " + path2);
      // this.shapes.push({
      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: x,
        yInner: y,
        wInner: w,
        hInner: h,
        xOuter: x - (this.selectWidth - w) / 2,
        yOuter: y,
        wOuter: this.selectWidth,
        hOuter: h,
        path1,
        path2
      });
    }

    this.shapes.push(newShape);
    this.selectedShapeId = newElementId;

    return newShape;
  }

  applyDeltaX(deltaX: number, shape: Shape) {
    shape.xInner += deltaX;
    shape.xOuter += deltaX;
  }
  applyDeltaY(deltaY: number, shape: Shape) {
    shape.yInner += deltaY;
    shape.yOuter += deltaY;
  }
  applyDeltaW(deltaX: number, shape: Shape) {
    shape.wInner += deltaX;
    shape.wOuter += deltaX;
  }
  applyDeltaH(deltaY: number, shape: Shape) {
    shape.hInner += deltaY;
    shape.hOuter += deltaY;
  }

  isOverlap(shape1: Shape, shape2: Shape): boolean {
    if (shape1.xInner + shape1.wInner < shape2.xInner) {
      return false;
    }
    else if (shape1.xInner > shape2.xInner + shape2.wInner) {
      return false;
    }
    else if (shape1.yInner + shape1.hInner < shape2.yInner) {
      return false;
    }
    else if (shape1.yInner > shape2.yInner + shape2.hInner) {
      return false;
    }
    return true;
  }

  saveConnectivityToModel() {
    console.log("saveConnectivityToModel");
    //Non-bus elements reference back to the bus
    for (let nonBusEl of this.getShapesNotOfType('bus')) {
      // var propertyTypeIds: {propertyTyepId:string,busId:string} [] = [];

      //load and gen... only have connId1
      if (nonBusEl.elementType != 'branch' && nonBusEl.connId1) {
        //In terms of the load, the bus is a fromBus
        if (nonBusEl.elementType === 'load') {
          this.modelElementDataService.setPropertyForElement(
            nonBusEl.elementId, 'fromBus', nonBusEl.connId1);
        }
        //...for a gen, the bus is a toBus
        else if (nonBusEl.elementType === 'gen') {
          this.modelElementDataService.setPropertyForElement(
            nonBusEl.elementId, 'toBus', nonBusEl.connId1);
        }
      }
      //branch
      else if (nonBusEl.elementType === 'branch') {
        var fromBus: string | undefined;
        var toBus: string | undefined;
        //If fully connected then fromBus is lowest alphabetically, other is toBus
        if (nonBusEl.connId1 && nonBusEl.connId2) {
          if (nonBusEl.connId1 < nonBusEl.connId2) {
            fromBus = nonBusEl.connId1;
            toBus = nonBusEl.connId2;
          }
          else {
            fromBus = nonBusEl.connId2;
            toBus = nonBusEl.connId1;  
          }
        }
        //else only one end connected... assign the fromBus
        else if (nonBusEl.connId1) {
          fromBus = nonBusEl.connId1;
        }
        else if (nonBusEl.connId2) {
          fromBus = nonBusEl.connId2;
        }
        this.modelElementDataService.setPropertyForElement(
          nonBusEl.elementId, 'toBus', toBus);
        this.modelElementDataService.setPropertyForElement(
            nonBusEl.elementId, 'fromBus', fromBus);
                
      }
    }
  }
}
