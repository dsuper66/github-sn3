import { Component, OnInit } from '@angular/core';
import { Shape } from '../shape';
import { Point } from '../point';
import { ShapeService } from '../shape.service';


@Component({
  selector: 'app-network-builder-view',
  templateUrl: './network-builder-view.component.html',
  styleUrls: ['./network-builder-view.component.css']
})
export class NetworkBuilderViewComponent implements OnInit {

  constructor(private shapeService: ShapeService) { }
  ngOnInit(): void {
    //If we navigate away then when we come back this will populate the display
    this.shapesToDraw = this.shapeService.getShapes();
  }

  shapesToDraw: Shape[] = [];
  selectedShape: Shape;
  lastDrawingPoint: Point; //For calculating delta as move progresses  
  //For checks at start of move
  firstPoint: Point;
  directionDone = false;
  //For knowing whether to draw or unselect
  drawingState = "stopped";
  //Touch can lead to touch evt followed by mouse... use timer to stop mouse
  touchTime = Date.now();
  //mouseTime = Date.now();

  //Add Element
  addElement(type: string) {
    console.log("add element:" + type);
    this.shapeService.addShape(type);
    this.shapesToDraw = this.shapeService.getShapes();
  }

  //Start drawing... checks
  startDrawingChecks(x: number, y: number) {
    //If inside a shape then this is adjusting
    console.log("start drawing checks");
    this.drawingState = "starting";
    var foundShape = false;
    for (let thisShape of this.shapesToDraw) {
      //console.log (thisShape.x);
      if (x >= thisShape.xOuter
        && x <= thisShape.xOuter + thisShape.wOuter
        && y >= thisShape.yOuter
        && y <= thisShape.yOuter + thisShape.hOuter) {

        //If this is already selected then a tap (starting -> stopped)
        //will unselect... for a new selection we want to "keepDrawing"
        if (this.selectedShape != thisShape) {
          console.log("new select");
          this.drawingState = "keepDrawing";
          this.selectedShape = thisShape;
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
    console.log("keep drawing");
    this.drawingState = "keepDrawing";
    //If we have a last drawing point...
    if (this.lastDrawingPoint && this.selectedShape) {

      //Start direction for bus or branch determines if resize or move
      if (this.selectedShape.type == 'bus' || this.selectedShape.type == 'branch') {
        if (!this.directionDone) {
          let xThreshold = 5;
          let yThreshold = 5;
          let deltaFromStartX = Math.abs(drawingPoint.x - this.firstPoint.x);
          let deltaFromStartY = Math.abs(drawingPoint.y - this.firstPoint.y);
          //Branch is resize if movement is up-down, bus is resize if movement is left-right
          if (deltaFromStartX > xThreshold || deltaFromStartY > yThreshold) {
            this.selectedShape.doResize = false;
            if (deltaFromStartY > yThreshold && this.selectedShape.type == 'branch') {
              console.log("Up Down");
              this.selectedShape.doResize = true;
            }
            else if (deltaFromStartX > xThreshold && this.selectedShape.type == 'bus') {
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
        if (this.selectedShape.type == 'bus') {
          let atRHS = (drawingPoint.x > this.selectedShape.xInner + this.selectedShape.wInner / 2);
          if (atRHS) {
            this.shapeService.applyDeltaW(deltaX, this.selectedShape);
          }
          else {
            this.shapeService.applyDeltaX(deltaX, this.selectedShape);
            this.shapeService.applyDeltaW(-deltaX, this.selectedShape);
          }
        }
        else if (this.selectedShape.type == 'branch') {
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

      this.lastDrawingPoint = drawingPoint;
    }
  }
  keepDrawingMouse(evt: MouseEvent) {
    console.log("keep drawing mouse");
    this.keepDrawing({ x: evt.offsetX, y: evt.offsetY });
  }
  keepDrawingTouch(evt: TouchEvent) {
    console.log("keep drawing touch");
    this.keepDrawing({ x: evt.touches[0].pageX, y: evt.touches[0].pageY });
    //this.checkIfPointIsInAnyShape(evt.touches[0].pageX, evt.touches[0].pageY)
  }

  stopDrawing() {
    console.log("stop drawing");

    //If there was no drawing, just start=>stop then unselect
    //(timer to avoid mouse/touch overlap)
    if (this.drawingState == "starting")  {
      console.log("unselect");
      this.selectedShape = null;
      this.shapesToDraw = this.shapeService.getShapes();
    }
    //stop any current adjustment (but stay selected)
    this.drawingState = "stopped";
    this.lastDrawingPoint = null;
    this.directionDone = false;


  }
  stopDrawingMouse() {
    this.stopDrawing();
  }
  stopDrawingTouch() {
    this.stopDrawing();
  }

}
