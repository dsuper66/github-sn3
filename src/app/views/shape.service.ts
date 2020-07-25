import { Injectable } from '@angular/core';
import { Shape } from './shape';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor() { }

  private shapes:Shape[]=[];

  branchLength = 100;
  branchWidth = 5;

  busInitX = 50;
  busInitY = 100;
  busLength = 120;
  busWidth = 14;

  genLoadLength = 42;
  genLoadWidth = 30;

  selectWidth = 40;

  addShape(type: string) {
    let count = this.shapes.filter(shape => shape.type == type).length;
    console.log (type + ":" + (this.getCount(type) + 1));

    //BUS
    if (type == 'bus') {
      let y = this.busInitY * (1 + this.getCount('bus'));
      this.shapes.push({
        type: type,
        xInner: this.busInitX,
        yInner: y,
        wInner: this.busLength,
        hInner: this.busWidth,
        xOuter: this.busInitX,
        yOuter: y - (this.selectWidth - this.busWidth)/2,
        wOuter: this.busLength,
        hOuter: this.selectWidth
       })
    }
    //BRANCH
    else if (type == 'branch') {
      let branchCountNew = this.getCount('branch') + 1;
      var x = 0;
      if (branchCountNew%2 == 1) {
        x = this.busInitX + 0.2*this.busLength; 
      }
      else {
        x = this.busInitX + 0.8*this.busLength - this.branchWidth
      };
      let y = (this.busInitY * Math.ceil(branchCountNew/2)) + this.busWidth/2;
      this.shapes.push({
        type: type,
        xInner: x,
        yInner: y,
        wInner: this.branchWidth,
        hInner: this.branchLength,
        xOuter: x - (this.selectWidth - this.branchWidth)/2,
        yOuter: y,
        wOuter: this.selectWidth,
        hOuter: this.branchLength
      })
    }
    //GEN & LOAD
    else if (type == 'gen' || type == 'load') {     
      let genLoadCount =  this.getCount('gen') + this.getCount('load')
      let h = this.genLoadLength;
      let w = this.genLoadWidth;
      let x = this.busInitX + this.busLength/2 - w/2;
      let y = (this.busInitY * (1 + genLoadCount)) - h;
      var path1: string;
      var path2: string;
      if (type == 'gen') {
        let sineStartX = 6;
        let sineStartY = w/2;
        let sineW = w - 2*sineStartX;
        path1 = `M ${sineStartX} ${sineStartY}           q ${sineW/4} ${-sineW/2} ${sineW/2} 0` 
        path2 = `M ${sineStartX + sineW/2} ${sineStartY} q ${sineW/4} ${sineW/2}  ${sineW/2} 0` 
      }
      else if (type == 'load') {
        let arrowH = 10;
        //<path id="lineAB" d="M 20 100 l 0 -98 m -18 18 l 18 -18 l 18 18"
        path1 = `M ${w/2} ${h} l 0 ${-(h-2)} m ${-arrowH} ${arrowH} l ${arrowH} ${-arrowH} l ${arrowH} ${arrowH}`
      }

      console.log("path1: " + path1 + " path2: " + path2);
      this.shapes.push({
        type: type,
        xInner: x,
        yInner: y,
        wInner: w,
        hInner: h,
        xOuter: x - (this.selectWidth - w)/2,
        yOuter: y,
        wOuter: this.selectWidth,
        hOuter: h,
        path1,
        path2
      });
    }
  }

  getCount(type: String) {
    return this.shapes.filter(shape => shape.type == type).length;
  }
  getShapes() {
    console.log("get shapes");
    return this.shapes;
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
}

