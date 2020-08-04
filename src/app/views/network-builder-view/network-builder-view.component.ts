import { Component, OnInit } from '@angular/core';
import { Shape } from '../shape';
import { Point } from '../point';
import { ShapeService } from '../shape.service';
import { ControlContainer } from '@angular/forms';


@Component({
  selector: 'app-network-builder-view',
  templateUrl: './network-builder-view.component.html',
  styleUrls: ['./network-builder-view.component.css']
})
export class NetworkBuilderViewComponent implements OnInit {

  constructor(private shapeService: ShapeService) { }
  ngOnInit(): void {
    //If we navigate away then when we come back this will populate the display
    this.selectedShape = this.shapeService.getSelectedShape();
    // if (this.selectedShape) {
    //   this.selectedId = this.selectedShape.elementId;
    // }
    // else {
    //   this.selectedId = "none selected";
    // }
    this.shapesToDraw = this.shapeService.getShapes();
  }

  shapesToDraw: Shape[] = [];
  selectedShape: Shape;
  // selectedId: string;

  //Drawing declarations
  lastDrawingPoint: Point; //For calculating delta as move progresses  
  //For checks at start of move
  firstPoint: Point;
  directionDone = true;
  //For knowing whether to draw or unselect
  drawingState = "stopped";
  //Touch can lead to touch evt followed by mouse... use timer to stop mouse
  touchTime = Date.now();

  //Add Element
  addElement(type: string) {
    console.log("add element:" + type);
    this.selectedShape = this.shapeService.addShape(type);
    // this.selectedShape = this.shapeService.getShapeWithId(this.selectedId);
    //this.selectedShape = this.shapeService.addShape(type);
    //this.selectedId = this.selectedShape.elementId;
    //this.shapeService.setSelectedShape(this.selectedShape);
    this.shapesToDraw = this.shapeService.getShapes();
    //Wait for draw and then check connectivity
    setTimeout(() => {
      this.checkForOverlaps()}, 5);    
  }

  //Start drawing... checks
  startDrawingChecks(x: number, y: number) {
    //If inside a shape then this is adjusting
    //console.log("start drawing checks");
    this.drawingState = "starting";
    var foundShape = false;
    for (let checkShape of this.shapesToDraw) {
      //console.log (thisShape.x);
      if (x >= checkShape.xOuter
        && x <= checkShape.xOuter + checkShape.wOuter
        && y >= checkShape.yOuter
        && y <= checkShape.yOuter + checkShape.hOuter) {

        //If this is already selected then a tap (starting -> stopped)
        //will unselect... for a new selection we want to "keepDrawing"
        if (this.selectedShape != checkShape) {
          console.log("new select");
          this.drawingState = "keepDrawing";
          this.selectedShape = checkShape;
          this.shapeService.setSelectedShape(checkShape);
          //For bus or branch need to check direction
          if (this.selectedShape.elementType == 'bus'
            || this.selectedShape.elementType == 'branch') {
            this.directionDone = false;
          }

        }


        //this.firstPoint = { x: x, y: y };
        //this.lastDrawingPoint = this.firstPoint;
        console.log("inside");
        //foundShape = true;
        //this.directionDone = false;
        break;
      }
    }
    //direction determines move or resize... reset it now at start 
    //and figure it out with keepDrawing
    this.directionDone = false;
    this.firstPoint = { x: x, y: y };
    this.lastDrawingPoint = this.firstPoint;
    //Not in any shape, reset select
    /*
    if (!foundShape) {
      this.lastDrawingPoint = null;
      this.selectedShape = null;
      this.shapesToDraw = this.shapeService.getShapes(); 
    }*/
  }
  startDrawingMouse(evt: MouseEvent) {
    console.log("startingMouse" + Date.now().toString);
    if ((Date.now() - this.touchTime) > 500) {
      this.startDrawingChecks(evt.offsetX, evt.offsetY)
    }
  }
  startDrawingTouch(evt: TouchEvent) {
    console.log("startingTouch" + Date.now().toString);
    this.touchTime = Date.now()
    this.startDrawingChecks(evt.touches[0].pageX, evt.touches[0].pageY)
  }

  keepDrawing(drawingPoint: Point) {
    //console.log("keep drawing");
    this.drawingState = "keepDrawing";
    //If we have a last drawing point and a selected shape then we are doing something
    if (this.lastDrawingPoint && this.selectedShape) {

      //Start direction for bus or branch determines if resize or move
      if (!this.directionDone) {
        if (this.selectedShape.elementType == 'bus' || this.selectedShape.elementType == 'branch') {
          let xThreshold = 5;
          let yThreshold = 5;
          let deltaFromStartX = Math.abs(drawingPoint.x - this.firstPoint.x);
          let deltaFromStartY = Math.abs(drawingPoint.y - this.firstPoint.y);
          //Branch is resize if movement is up-down, 
          //bus is resize if movement is left-right
          if (deltaFromStartX > xThreshold || deltaFromStartY > yThreshold) {
            this.selectedShape.doResize = false;
            if (deltaFromStartY > yThreshold
              && this.selectedShape.elementType == 'branch') {
              console.log("Up Down");
              this.selectedShape.doResize = true;
            }
            else if (deltaFromStartX > xThreshold
              && this.selectedShape.elementType == 'bus') {
              console.log("Left Right");
              this.selectedShape.doResize = true;
            }
            this.directionDone = true;
          }
          else { //don't move or resize until we know which
            return
          }
        }
      }

      //Adjust... resize or move
      let deltaX = drawingPoint.x - this.lastDrawingPoint.x;
      let deltaY = drawingPoint.y - this.lastDrawingPoint.y;

      //Resize (bus or branch)
      if (this.selectedShape.doResize) {
        if (this.selectedShape.elementType == 'bus') {
          let atRHS = (drawingPoint.x > this.selectedShape.xInner + this.selectedShape.wInner / 2);
          if (atRHS) {
            this.shapeService.applyDeltaW(deltaX, this.selectedShape);
          }
          else {
            this.shapeService.applyDeltaX(deltaX, this.selectedShape);
            this.shapeService.applyDeltaW(-deltaX, this.selectedShape);
          }
        }
        else if (this.selectedShape.elementType == 'branch') {
          let atBottom = (drawingPoint.y > this.selectedShape.yInner + this.selectedShape.hInner / 2);
          if (atBottom) {
            this.shapeService.applyDeltaH(deltaY, this.selectedShape);
          }
          else {
            this.shapeService.applyDeltaY(deltaY, this.selectedShape);
            this.shapeService.applyDeltaH(-deltaY, this.selectedShape);
          }
        }
      }
      //Move
      else {
        this.selectedShape.xInner += deltaX;
        this.selectedShape.yInner += deltaY;
        this.selectedShape.xOuter += deltaX;
        this.selectedShape.yOuter += deltaY;
      }
      // if (deltaX > 5 || deltaY > 5) {
      this.checkForOverlaps();
      // }
      this.lastDrawingPoint = drawingPoint;
    }
  }
  keepDrawingMouse(evt: MouseEvent) {
    //console.log("keep drawing mouse");
    this.keepDrawing({ x: evt.offsetX, y: evt.offsetY });
  }
  keepDrawingTouch(evt: TouchEvent) {
    //console.log("keep drawing touch");
    this.keepDrawing({ x: evt.touches[0].pageX, y: evt.touches[0].pageY });
    //this.checkIfPointIsInAnyShape(evt.touches[0].pageX, evt.touches[0].pageY)
  }

  stopDrawing() {
    console.log("stop drawing");

    //If there was no drawing, just start=>stop then unselect
    //(timer to avoid mouse/touch overlap)
    if (this.drawingState == "starting") {
      console.log("unselect");
      this.selectedShape = null;
      // this.selectedId = "none selected";
      this.shapesToDraw = this.shapeService.getShapes();
    }
    //stop any current adjustment (but stay selected)
    this.drawingState = "stopped";
    this.lastDrawingPoint = null;
    this.directionDone = true;

  }
  stopDrawingMouse() {
    this.stopDrawing();
  }
  stopDrawingTouch() {
    this.stopDrawing();
  }

  setConnectivityColor(shape: Shape) {
    let isFullyConnected =
      (shape.elementType != 'branch' && shape.busId1 != "")
      || (shape.busId1 != "" && shape.busId2 != "");
    var el = document.getElementById(shape.elementId);
    el.setAttribute("stroke", (isFullyConnected ? "black" : "lime"));
    // if (isConnected) {
    //   el.setAttribute("stroke", "black");
    // }
    // else {
    //   el.setAttribute("stroke", "lime");
    // }
    if (shape.elementType === 'bus' || shape.elementType === 'branch') {
      el.setAttribute("fill", (isFullyConnected ? "black" : "lime"));
    }
  }

  checkForOverlaps() {
    // var overlap = !(rect1.right < rect2.left || 
    //   rect1.left > rect2.right || 
    //   rect1.bottom < rect2.top || 
    //   rect1.top > rect2.bottom)
    if (this.selectedShape.elementType === 'gen'
      || this.selectedShape.elementType === 'load'
      || this.selectedShape.elementType === 'branch'
      || this.selectedShape.elementType === 'bus') {
      //Bus is moving
      if (this.selectedShape.elementType === 'bus') {
        let theBus = this.selectedShape;
        for (let theNotBus of this.shapeService.getShapesNotOfType('bus')) {
          //connected
          if (this.shapeService.isOverlap(theNotBus, theBus)) {
            //not a branch
            if (theNotBus.elementType != 'branch') {
              if (theNotBus.busId1 === "") { //don't steel other connections
                theNotBus.busId1 = theBus.elementId;
              }
            }
            //branch... only connect if not already
            else {
              if (theNotBus.busId1 != theBus.elementId
              && theNotBus.busId2 != theBus.elementId) {
                if (theNotBus.busId1 === "") {
                  theNotBus.busId1 = theBus.elementId;
                }
                else if (theNotBus.busId2 === "") {
                  theNotBus.busId2 = theBus.elementId;
                }
              }
            }
          }
          //not connected... if was connected then but not now (bus1)
          else if (theNotBus.busId1 === theBus.elementId) {
            theNotBus.busId1 = "";
          }
          //if was connected then now not (bus2... branch only)
          else if (theNotBus.busId2 === theBus.elementId) {
            theNotBus.busId2 = "";
          }
          this.setConnectivityColor(theNotBus);
        }
      }
      //Non-bus is moving
      else {
        let theNotBus = this.selectedShape;
        let theBuses = this.shapeService.getShapesOfType('bus');
        theNotBus.busId1 = "";
        theNotBus.busId2 = "";
        for (let theBus of theBuses) {
          if (this.shapeService.isOverlap(theNotBus, theBus)) {
            //Assign bus1 if this is not a branch
            if (theNotBus.elementType != "branch") {
              theNotBus.busId1 = theBus.elementId;
              break;
            }
            else { //branch
              if (theNotBus.busId1 === "") {
                theNotBus.busId1 = theBus.elementId;
              }
              else if (theNotBus.busId2 === "") {
                theNotBus.busId2 = theBus.elementId;
              }
              else { //have two buses
                break;
              }
            }
          }
        }

        this.setConnectivityColor(theNotBus);
      }

      // if (genOrLoadId) {
      //   var el = document.getElementById(genOrLoadId);
      //   if (genOrLoadHasBus) {
      //     el.setAttribute("stroke", "black");
      //   }
      //   else {
      //     el.setAttribute("stroke", "lime");
      //   }
      // }
      // let otherShapes = (this.selectedShape.elementType === 'bus')
      //   ? this.shapeService.getShapesOfType('gen')
      //   : this.shapeService.getShapesOfType('bus');

      // for (let otherShape of otherShapes) {
      //   console.log("checking " + otherShape.elementId);
      //   if (this.shapeService.isOverlap(otherShape,this.selectedShape)){
      //     //this.selectedShape.strokeColor = "black";
      //     console.log(this.selectedShape.elementId 
      //       + " is connected to " + otherShape.elementId);
      //     var el = document.getElementById("gen");
      //     el.setAttribute("stroke", "black")
      //   }
      //   else {
      //     //this.selectedShape.strokeColor = "lawngreen";
      //     var el = document.getElementById("gen");
      //     el.setAttribute("stroke", "lime")
      //   }
      // }
    }
  }

  getCanvasSize(): string {
    var el = document.getElementById("body"); // or other selector like querySelector()
    var rect = el.getBoundingClientRect(); // get the bounding rectangle



    // console.log(">>> x:" + rect.left + " y:" + rect.top + " w:" + rect.width + "h:" + rect.height);
    return "done";
  }

}
