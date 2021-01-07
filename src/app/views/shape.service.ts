import { Injectable } from '@angular/core';
import { Shape } from './shape';
import { ModelElementService } from '../data-model/model-element.service'
import { ModelElementDataService } from '../data-model/model-element-data.service'
import { from } from 'rxjs';
import { Point } from './point';
import { max } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(
    private modelElementService: ModelElementService,
    private modelElementDataService: ModelElementDataService
  ) { }

  private shapes: Shape[] = [];

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

  //Whether to enable the solve button
  haveModel():boolean{return(this.shapes.length > 0)}

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

    var newElementId = ""

    //See if we need to add an island or mathModel
    if (elementType != 'island' && elementType != 'mathModel') {
      if (!(this.shapes.find(s => s.elementType === 'island'))) {
        this.addShape('island');
      }
      if (!(this.shapes.find(s => s.elementType === 'mathModel'))) {
        this.addShape('mathModel');
      }
    }    

    //Add the element and get back the i.d.
    newElementId = this.modelElementService.addModelElement(elementType);


    var newShape = new Shape;

    //Placement
    console.log(newElementId + ":" + elementType + " count:" + (this.getCountShapesOfType(elementType) + 1));
    //Defaults
    const branchInitLength = 184;
    const busInitX = 30;
    const busInitY = 120;
    const busInitLength = 160;
    const branchWidth = 5;
    const busWidth = 14;
    const genLoadLength = 42;
    const genLoadWidth = 30;


    //Selection box
    const selectWidth = 40;

    //Counts
    const busCount = this.getCountShapesOfType('bus');
    const brCount = this.getCountShapesOfType('branch');

    //Bus highest to lowest
    const busesHighestToLowest = this.getShapesOfType('bus').sort((a,b) => a.yInner > b.yInner ? 1 : -1);

    //BUS
    if (elementType == 'bus') {
      //Place based on number of buses
      let y = busInitY + branchInitLength * busCount;
      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: busInitX,
        yInner: y,
        wInner: busInitLength,
        hInner: busWidth,
        xOuter: busInitX,
        yOuter: y - (selectWidth - busWidth) / 2,
        wOuter: busInitLength,
        hOuter: selectWidth
      })
      //console.log(">>>" + (busInitX) + " " + (y + busWidth / 2))
    }
    //BRANCH
    else if (elementType == 'branch') {

      const brInsetFactor = 0.92
      //Default locations
      const brInsetLeft = busInitX + brInsetFactor * busInitLength
      const brInsetRight = busInitX + (1 - brInsetFactor) * busInitLength - branchWidth
      var brLength = branchInitLength; //default br length if no next bus found
      var y = busInitY + busWidth / 2;
      let branchCountNew = brCount + 1;
      var x = 0;
      //Inset from left or right
      if (branchCountNew % 2 == 1) {
        x = brInsetLeft;
      }
      else {
        x = brInsetRight
      };      

      //Look for an available bus
      const brConnUnderBus = busesHighestToLowest.map(bus => 
        this.modelElementDataService.getBusConnections(bus.elementId,['branch']).filter(brId => 
          this.getShapePoint(brId).y > this.getShapePoint(bus.elementId).y));
      const brCountForBus = brConnUnderBus.map(brArray => brArray.length);

      //Find first bus that has less than max connections
      const maxAllowableBrCount = 2; //(connected below)
      const topBusEligibleIndex = brCountForBus.findIndex(bc => bc < maxAllowableBrCount);
      console.log("%%%%%% connBrIdUnderBus:" + brConnUnderBus + " top eligible:" + topBusEligibleIndex);
      
      if (topBusEligibleIndex >= 0) {        
        const fromBus = busesHighestToLowest[topBusEligibleIndex];
        y = fromBus.yInner + busWidth / 2;
        //Length to Connect to next bus down, if any
        if (topBusEligibleIndex < busesHighestToLowest.length - 1) {
          brLength = busesHighestToLowest[topBusEligibleIndex + 1].yInner - fromBus.yInner;
        }
        const brInsetLeft = busInitX + brInsetFactor * busInitLength
        const brInsetRight = busInitX + (1 - brInsetFactor) * busInitLength - branchWidth
        if (brCountForBus[topBusEligibleIndex] == 0) {
          x = fromBus.xInner + (1 - brInsetFactor) * fromBus.wInner;
        }
        else {
          x = fromBus.xInner + (brInsetFactor) * fromBus.wInner - branchWidth
        }

      }
      else {
        //The default y and length will be used... Ideally return a message to raise an alert
        console.log("%%%%%%No bus eligible for tidy connection");
      }


      const xOuter = x - (selectWidth - branchWidth) / 2;

      //Flow direction Arrow
      const w = selectWidth;
      const arrowH = 15;
      const inset = 7;
      path1 = `M ${inset} 0 l ${w/2 - inset} ${arrowH} l ${w/2 - inset} ${-arrowH}`;
      path2 = `M ${inset} ${arrowH + 2} l ${w/2 - inset} ${-arrowH} l ${w/2 - inset} ${arrowH}`;      

      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: x,
        yInner: y,
        wInner: branchWidth,
        hInner: brLength,
        xOuter: xOuter,
        yOuter: y,
        wOuter: selectWidth,
        hOuter: brLength,
        path1: path1,
        path2: path2
      })
    }

    //GEN & LOAD
    else if (elementType == 'gen' || elementType == 'load') {
      const genLoadInsetFactor = 0.25;

      //Default locations      
      let genLoadCount = this.getCountShapesOfType('gen') + this.getCountShapesOfType('load')
      let h = genLoadLength;
      let w = genLoadWidth;
      let x = busInitX + busInitLength / 2 - w / 2;
      //Y position
      var y = busInitY - h;
      if (busCount > 1 && genLoadCount > 0) { //position on last bus
        y = busInitY + (branchInitLength * (busCount - 1)) - h;
      }

      //Try and find a bus to connect to
      const genLoadConnAtBus = busesHighestToLowest.map(bus => 
        this.modelElementDataService.getBusConnections(bus.elementId,['gen','load']));
      const glCountForBus = genLoadConnAtBus.map(brArray => brArray.length);
      const minCount = glCountForBus.reduce((p,c) => p < c ? p : c);
      //Find first bus that has least connections
      const maxAllowableGenLoadCount = 2;
      const topBusEligibleIndex = glCountForBus.findIndex(glc => glc < maxAllowableGenLoadCount && glc == minCount);
      if (topBusEligibleIndex >= 0) {
        const atBus = busesHighestToLowest[topBusEligibleIndex];
        y = atBus.yInner - h;
        if (glCountForBus[topBusEligibleIndex] == 0) {
          x = atBus.xInner + atBus.wInner / 4 - w/2;
        }
        else {
          x = atBus.xInner + atBus.wInner * 3 / 4 - w/2;
        }
      }

      //Draw
      var path1: string | undefined;
      var path2: string | undefined;
      if (elementType == 'gen') {
        //gen sine wave
        let sineStartX = 6;
        let sineStartY = w / 2;
        let sineW = w - 2 * sineStartX;
        path1 = `M ${sineStartX} ${sineStartY}           q ${sineW / 4} ${-sineW / 2} ${sineW / 2} 0`
        path2 = `M ${sineStartX + sineW / 2} ${sineStartY} q ${sineW / 4} ${sineW / 2}  ${sineW / 2} 0`
      }
      else if (elementType == 'load') {
        //load arrow
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
        xOuter: x - (selectWidth - w) / 2,
        yOuter: y,
        wOuter: selectWidth,
        hOuter: h,
        path1,
        path2
      });
    }
    //ISLAND & MATHMODEL
    else if (elementType == 'island' || elementType == 'mathModel') {
      const xDistFromBus = 22
      const x = busInitX + busInitLength + xDistFromBus;
      var y = 50;
      const margin = 6
      const h = 55;
      const w = selectWidth + 10
      if (elementType == 'island') {
        y = y + h + 10
      }
      newShape = ({
        elementType: elementType,
        elementId: newElementId,
        xInner: x + margin,
        yInner: y,
        wInner: w - 2 * margin,
        hInner: h,
        xOuter: x,
        yOuter: y,
        wOuter: w,
        hOuter: h
      })

    }

    this.shapes.push(newShape);
    this.selectedShapeId = newElementId;

    return newShape;
  }

  getShapePoint(elementId: string): Point {
    const shape = this.shapes.find(s => s.elementId === elementId);
    if (shape) {
      return {x: shape.xInner, y: shape.yInner};
    }
    else {
      return {x:0, y:0};
    }
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

  //Convert the shape connectivity to model connectivity
  saveConnectivityToModel() {
    // console.log("saveConnectivityToModel");

    //Non-bus elements reference back to the bus
    for (let nonBusEl of this.getShapesNotOfType('bus')) {
      var fromBus: string | undefined = undefined;
      var toBus: string | undefined = undefined;

      //load and gen... only have connId1
      if (nonBusEl.elementType != 'branch' && nonBusEl.connId1) {
        //In terms of the load, the bus is a fromBus
        if (nonBusEl.elementType === 'load') {
          fromBus = nonBusEl.connId1;
          // this.modelElementDataService.setPropertyForElement(
          //   nonBusEl.elementId, 'fromBus', nonBusEl.connId1);
        }
        //...for a gen, the bus is a toBus
        else if (nonBusEl.elementType === 'gen') {
          toBus = nonBusEl.connId1;
          // this.modelElementDataService.setPropertyForElement(
          //   nonBusEl.elementId, 'toBus', nonBusEl.connId1);
        }
      }
      //branch
      else if (nonBusEl.elementType === 'branch') {
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
      }

      this.modelElementDataService.setPropertyForElement(
        nonBusEl.elementId, 'toBus', toBus);
      this.modelElementDataService.setPropertyForElement(
        nonBusEl.elementId, 'fromBus', fromBus);
    }
  }

  //Assign results to text fields of the shapes
  applyResultsToShapesText() {
    for (const shape of this.shapes) {
      [shape.text1,shape.text2,shape.text3,shape.text4] = 
        this.modelElementDataService.getTextFromElementResults(shape.elementId);
    }
  }
}
