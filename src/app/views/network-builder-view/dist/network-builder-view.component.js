"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NetworkBuilderViewComponent = void 0;
var core_1 = require("@angular/core");
var NetworkBuilderViewComponent = /** @class */ (function () {
    function NetworkBuilderViewComponent(shapeService, solverCallService, mathModelDefService, http, renderer) {
        this.shapeService = shapeService;
        this.solverCallService = solverCallService;
        this.mathModelDefService = mathModelDefService;
        this.http = http;
        this.renderer = renderer;
        this.shapesToDraw = [];
        this.directionDone = true;
        //For knowing whether to draw or unselect
        this.drawingState = "stopped";
        //Touch can lead to touch evt followed by mouse... use timer to stop mouse
        this.touchTime = Date.now();
    }
    NetworkBuilderViewComponent.prototype.ngOnInit = function () {
        //If we navigate away then when we come back this will populate the display
        this.selectedShape = this.shapeService.getSelectedShape();
        this.shapesToDraw = this.shapeService.getShapes();
        this.reservesEnabled = this.getReservesEnabled();
        this.lossesEnabled = this.getLossesEnabled();
        // this.http.get<{ip:string}>('https://jsonip.com')
        // .subscribe( data => {
        //   console.log('*********************ip address:', data.ip);
        //   this.solverCallService.ipAddress = data.ip;
        // })
        // this.http.get<IpData>('https://ipapi.co/json')
        // .subscribe( ipData => {
        //   const ipString = "ip: " + ipData.ip + ", city: " + ipData.city + ", region: " + ipData.region + ", country: " + ipData.country
        //   console.log('*********************' + ipString);
        //   this.solverCallService.ipAddress = ipString;
        // })
    };
    NetworkBuilderViewComponent.prototype.textForShape = function (shapeType) {
        if (shapeType === 'island') {
            return "i";
        }
        else if (shapeType === 'mathModel') {
            return "m";
        }
    };
    NetworkBuilderViewComponent.prototype.haveModel = function () { return this.shapeService.haveModel(); };
    NetworkBuilderViewComponent.prototype.solveInProgress = function () { return this.solverCallService.solveInProgress; };
    ;
    NetworkBuilderViewComponent.prototype.solveModel = function () {
        this.solverCallService.solveModel();
    };
    NetworkBuilderViewComponent.prototype.setReservesEnabled = function (status) {
        this.mathModelDefService.setReservesEnabled(status);
        // console.log("set reserves:" + status);
        // this.mathModelDefService.setItemStatus(ItemType.Constraint, "resCover", status);
    };
    NetworkBuilderViewComponent.prototype.getReservesEnabled = function () {
        return this.mathModelDefService.getReservesEnabled();
        // console.log("get reserves");
        // return this.mathModelDefService.itemIsEnabled(ItemType.Constraint, "resCover");
    };
    NetworkBuilderViewComponent.prototype.setLossesEnabled = function (status) {
        this.mathModelDefService.setLossesEnabled(status);
        // console.log("set losses:" + status);
        // this.mathModelDefService.setItemStatus(ItemType.Constraint, "segLossForFlow", status);
        // this.mathModelDefService.setItemStatus(ItemType.VarFactor, "dirBranch.branchLoss", status);
    };
    NetworkBuilderViewComponent.prototype.getLossesEnabled = function () {
        return this.mathModelDefService.getLossesEnabled();
        // console.log("get losses");
        // if (!this.mathModelDefService.itemIsEnabled(ItemType.Constraint, "segLossForFlow")
        // && !this.mathModelDefService.itemIsEnabled(ItemType.VarFactor, "dirBranch.branchLoss")) {
        //   return false;
        // }
        // else {
        //   return true;
        // }
    };
    //Add Element
    NetworkBuilderViewComponent.prototype.addElement = function (type) {
        var _this = this;
        console.log("add element:" + type);
        this.selectedShape = this.shapeService.addShape(type);
        this.shapesToDraw = this.shapeService.getShapes();
        //Wait for draw and then check connectivity (otherwise the check occurs before the draw)
        setTimeout(function () {
            _this.checkForOverlaps();
        }, 5);
    };
    //Start drawing... checks
    NetworkBuilderViewComponent.prototype.startDrawingChecks = function (x, y) {
        //If inside a shape then this is adjusting
        //console.log("start drawing checks");
        this.drawingState = "starting";
        // this.doUpdateResults = false;
        var foundShape = false;
        for (var _i = 0, _a = this.shapesToDraw; _i < _a.length; _i++) {
            var checkShape = _a[_i];
            //Check if touch is inside any shape
            //console.log (thisShape.x);
            if (x >= checkShape.xOuter
                && x <= checkShape.xOuter + checkShape.wOuter
                && y >= checkShape.yOuter
                && y <= checkShape.yOuter + checkShape.hOuter) {
                //Inside a shape... now check what we are doing
                //If this is already selected then a tap (starting -> stopped)
                //will unselect... for a new selection we want to "keepDrawing"
                if (this.selectedShape != checkShape) {
                    console.log("new select");
                    this.drawingState = "keepDrawing";
                    this.selectedShape = checkShape;
                    this.shapeService.setSelectedShapeId(checkShape.elementId);
                }
                break;
            }
        }
        //direction determines move or resize... reset it now at start 
        //and figure it out with keepDrawing
        this.directionDone = false;
        this.firstPoint = { x: x, y: y };
        this.lastDrawingPoint = this.firstPoint;
    };
    NetworkBuilderViewComponent.prototype.startDrawingMouse = function (evt) {
        console.log("startingMouse" + Date.now().toString);
        if ((Date.now() - this.touchTime) > 500) {
            this.startDrawingChecks(evt.offsetX, evt.offsetY);
        }
    };
    NetworkBuilderViewComponent.prototype.startDrawingTouch = function (evt) {
        console.log("startingTouch" + Date.now().toString);
        this.touchTime = Date.now();
        this.startDrawingChecks(evt.touches[0].pageX, evt.touches[0].pageY);
    };
    NetworkBuilderViewComponent.prototype.keepDrawing = function (drawingPoint) {
        //console.log("keep drawing");
        this.drawingState = "keepDrawing";
        //If we have a last drawing point and a selected shape then we are doing something
        if (this.lastDrawingPoint && this.selectedShape) {
            //Start direction for bus or branch determines if resize or move
            var deltaFromStartX = 0;
            var deltaFromStartY = 0;
            if (!this.directionDone) {
                if (this.selectedShape.elementType == 'bus' || this.selectedShape.elementType == 'branch') {
                    var xThreshold = 5;
                    var yThreshold = 5;
                    deltaFromStartX = Math.abs(drawingPoint.x - this.firstPoint.x);
                    deltaFromStartY = Math.abs(drawingPoint.y - this.firstPoint.y);
                    //Branch is resize if movement is up-down, 
                    //bus is resize if movement is left-right
                    if (deltaFromStartX > xThreshold || deltaFromStartY > yThreshold) {
                        //Start by assuming a resize (one direction is greater than threshold)
                        this.selectedShape.doResize = false;
                        //Then see if it is a resize
                        if (deltaFromStartY > yThreshold
                            && this.selectedShape.elementType == 'branch') {
                            // console.log("Up Down");
                            this.selectedShape.doResize = true;
                        }
                        else if (deltaFromStartX > xThreshold
                            && this.selectedShape.elementType == 'bus') {
                            // console.log("Left Right");
                            this.selectedShape.doResize = true;
                        }
                        this.directionDone = true;
                    }
                    else { //don't move or resize until we know which
                        return;
                    }
                }
            }
            //Direction is done, also check for ROTATE (***not used***)
            else if (this.selectedShape.elementType == 'branch'
                && this.selectedShape.doResize) {
                deltaFromStartX = (drawingPoint.x - this.firstPoint.x);
                if (deltaFromStartX > 50) {
                    console.log("DIAGONAL+");
                }
                else if (deltaFromStartX < -50) {
                    console.log("DIAGONAL-");
                }
                // var el = document.getElementById(this.selectedShape.elementId);
                // this.renderer.setStyle(el, "transform", "rotate(-45deg)");
            }
            //Adjust... resize or move
            var deltaX = drawingPoint.x - this.lastDrawingPoint.x;
            var deltaY = drawingPoint.y - this.lastDrawingPoint.y;
            //Resize (bus or branch)
            if (this.selectedShape.doResize) {
                if (this.selectedShape.elementType == 'bus') {
                    var atRHS = (drawingPoint.x > this.selectedShape.xInner + this.selectedShape.wInner / 2);
                    if (atRHS) {
                        this.shapeService.applyDeltaW(deltaX, this.selectedShape);
                    }
                    else {
                        this.shapeService.applyDeltaX(deltaX, this.selectedShape);
                        this.shapeService.applyDeltaW(-deltaX, this.selectedShape);
                    }
                }
                else if (this.selectedShape.elementType == 'branch') {
                    var atBottom = (drawingPoint.y > this.selectedShape.yInner + this.selectedShape.hInner / 2);
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
            //===Connectivity processing===
            // if (deltaX > 5 || deltaY > 5) {
            this.checkForOverlaps();
            // }
            this.lastDrawingPoint = drawingPoint;
        }
    };
    NetworkBuilderViewComponent.prototype.keepDrawingMouse = function (evt) {
        //console.log("keep drawing mouse");
        this.keepDrawing({ x: evt.offsetX, y: evt.offsetY });
    };
    NetworkBuilderViewComponent.prototype.keepDrawingTouch = function (evt) {
        //console.log("keep drawing touch");
        this.keepDrawing({ x: evt.touches[0].pageX, y: evt.touches[0].pageY });
        //this.checkIfPointIsInAnyShape(evt.touches[0].pageX, evt.touches[0].pageY)
    };
    NetworkBuilderViewComponent.prototype.stopDrawing = function () {
        console.log("stop drawing");
        //Unselect if just a tap... (no drawing, just start=>stop)
        if (this.drawingState == "starting") {
            //Reset selected shape
            this.selectedShape = undefined;
            this.shapeService.setSelectedShapeId(undefined);
            this.shapesToDraw = this.shapeService.getShapes();
        }
        //Stop any current adjustment (but stay selected)
        this.drawingState = "stopped";
        this.lastDrawingPoint = undefined;
        this.directionDone = true;
    };
    NetworkBuilderViewComponent.prototype.stopDrawingMouse = function () {
        this.stopDrawing();
    };
    NetworkBuilderViewComponent.prototype.stopDrawingTouch = function () {
        this.stopDrawing();
    };
    //Update connectivity (after checking for overlaps)
    NetworkBuilderViewComponent.prototype.setConnectivity = function (shape) {
        if (shape.elementType != 'island') {
            var isFullyConnected = (shape.elementType != 'branch' && shape.connId1 != "")
                || (shape.connId1 != "" && shape.connId2 != "");
            //Use renderer, not attribute
            //https://medium.com/better-programming/angular-manipulate-properly-the-dom-with-renderer-16a756508cba
            //https://stackoverflow.com/questions/54507984/angular-how-to-modify-css-transform-property-of-html-elements-inside-a-compone
            //(with changes to setProperty)
            //Set connectivity colour
            var el = document.getElementById(shape.elementId);
            if (el != undefined) {
                //Set stroke colour
                this.renderer.setProperty(el.style, "stroke", (isFullyConnected ? "black" : "lime"));
                //Bus and branch also set fill colour
                if (shape.elementType === 'bus' || shape.elementType === 'branch') {
                    this.renderer.setProperty(el.style, "fill", (isFullyConnected ? "black" : "lime"));
                }
                // this.renderer.setProperty(el.style,
                //   "stroke-width", "4");
            }
            //Save shape connectivity to element model
            this.shapeService.saveConnectivityToModel();
        }
    };
    //Check for overlaps (then call Connectivity Processing)
    NetworkBuilderViewComponent.prototype.checkForOverlaps = function () {
        if (this.selectedShape != undefined) {
            console.log("checkForOverlaps:" + this.selectedShape.elementId + " type:" + this.selectedShape.elementType);
            //Bus is moving
            if (this.selectedShape.elementType === 'bus') {
                var theBus = this.selectedShape;
                //Check connectivity of all non-bus shapes
                for (var _i = 0, _a = this.shapeService.getShapesNotOfType('bus'); _i < _a.length; _i++) {
                    var theNotBus = _a[_i];
                    //overlapped
                    if (this.shapeService.isOverlap(theNotBus, theBus)) {
                        //not a branch
                        if (theNotBus.elementType == 'gen' || theNotBus.elementType == 'load') {
                            if (theNotBus.connId1 === "") { //don't steal other connections
                                theNotBus.connId1 = theBus.elementId;
                            }
                        }
                        //branch... only connect if not already
                        else {
                            if (theNotBus.connId1 != theBus.elementId
                                && theNotBus.connId2 != theBus.elementId) {
                                if (theNotBus.connId1 === "") {
                                    theNotBus.connId1 = theBus.elementId;
                                }
                                else if (theNotBus.connId2 === "") {
                                    theNotBus.connId2 = theBus.elementId;
                                }
                            }
                        }
                    }
                    //not connected... if was connected then but not now (bus1)
                    else if (theNotBus.connId1 === theBus.elementId) {
                        theNotBus.connId1 = "";
                    }
                    //if was connected then now not (bus2... branch only)
                    else if (theNotBus.connId2 === theBus.elementId) {
                        theNotBus.connId2 = "";
                    }
                    this.setConnectivity(theNotBus);
                }
            }
            //Non-bus is moving
            else if (this.selectedShape.elementType === 'branch'
                || this.selectedShape.elementType === 'gen'
                || this.selectedShape.elementType === 'load') {
                var theNotBus = this.selectedShape;
                var theBuses = this.shapeService.getShapesOfType('bus');
                theNotBus.connId1 = "";
                theNotBus.connId2 = "";
                for (var _b = 0, theBuses_1 = theBuses; _b < theBuses_1.length; _b++) {
                    var theBus = theBuses_1[_b];
                    if (this.shapeService.isOverlap(theNotBus, theBus)) {
                        //Assign bus1 if this is not a branch
                        if (theNotBus.elementType != "branch") {
                            theNotBus.connId1 = theBus.elementId;
                            break;
                        }
                        else { //branch
                            if (theNotBus.connId1 === "") {
                                theNotBus.connId1 = theBus.elementId;
                            }
                            else if (theNotBus.connId2 === "") {
                                theNotBus.connId2 = theBus.elementId;
                            }
                            else { //have two buses already
                                break;
                            }
                        }
                    }
                }
                this.setConnectivity(theNotBus);
            }
        }
    };
    NetworkBuilderViewComponent.prototype.deleteSelectedShape = function () {
        if (this.selectedShape != undefined) {
            this.shapeService.deleteShape(this.selectedShape.elementId);
            this.shapesToDraw = this.shapeService.getShapes();
            this.selectedShape = undefined;
        }
    };
    NetworkBuilderViewComponent = __decorate([
        core_1.Component({
            selector: 'app-network-builder-view',
            templateUrl: './network-builder-view.component.html',
            styleUrls: ['./network-builder-view.component.css']
        })
    ], NetworkBuilderViewComponent);
    return NetworkBuilderViewComponent;
}());
exports.NetworkBuilderViewComponent = NetworkBuilderViewComponent;
