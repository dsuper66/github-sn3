"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ShapeService = void 0;
var core_1 = require("@angular/core");
var shape_1 = require("./shape");
var ShapeService = /** @class */ (function () {
    function ShapeService(modelElementService, modelElementDataService) {
        this.modelElementService = modelElementService;
        this.modelElementDataService = modelElementDataService;
        this.shapes = [];
    }
    ShapeService.prototype.setSelectedShapeId = function (selectedShapeId) {
        this.selectedShapeId = selectedShapeId;
    };
    ShapeService.prototype.getSelectedShape = function () {
        if (this.selectedShapeId != undefined) {
            return this.getShapeWithId(this.selectedShapeId);
        }
        else {
            return undefined;
        }
    };
    //Whether to enable the solve button
    ShapeService.prototype.haveModel = function () { return (this.shapes.length > 0); };
    //Delete
    ShapeService.prototype.deleteShape = function (elementId) {
        this.shapes = this.shapes.filter(function (shape) { return shape.elementId != elementId; });
        this.modelElementDataService.deleteElement(elementId);
    };
    //Get shapes
    ShapeService.prototype.getShapes = function () {
        console.log("get shapes");
        return this.shapes;
    };
    ShapeService.prototype.getShapeWithId = function (elementId) {
        return this.shapes.filter(function (shape) { return shape.elementId === elementId; })[0];
    };
    //Shapes of type
    //***this happens multiple times during a move *****/
    ShapeService.prototype.getShapesOfType = function (elementType) {
        var filtered = this.shapes.filter(function (shape) { return shape.elementType === elementType; });
        // for (let element of filtered) {
        //   console.log("shapes of type:" + elementType + " = " + element.elementId);
        // }
        return filtered;
    };
    //...and not of type
    ShapeService.prototype.getShapesNotOfType = function (elementType) {
        return this.shapes.filter(function (shape) { return shape.elementType != elementType; });
    };
    ShapeService.prototype.getCountShapesOfType = function (elementType) {
        return this.getShapesOfType(elementType).length;
        //return this.shapes.filter(shape => shape.elementType === elementType).length;
    };
    //Add a shape
    ShapeService.prototype.addShape = function (elementType) {
        var _this = this;
        var newElementId = "";
        //See if we need to add an island or mathModel
        if (elementType != 'island' && elementType != 'mathModel') {
            if (!(this.shapes.find(function (s) { return s.elementType === 'island'; }))) {
                this.addShape('island');
            }
            if (!(this.shapes.find(function (s) { return s.elementType === 'mathModel'; }))) {
                this.addShape('mathModel');
            }
        }
        //Add the element and get back the i.d.
        newElementId = this.modelElementService.addModelElement(elementType);
        var newShape = new shape_1.Shape;
        //Placement
        console.log(newElementId + ":" + elementType + " count:" + (this.getCountShapesOfType(elementType) + 1));
        //Defaults
        var branchInitLength = 160;
        var busInitX = 30;
        var busInitY = 120;
        var busInitLength = 160;
        var branchWidth = 5;
        var busWidth = 14;
        var genLoadLength = 42;
        var genLoadWidth = 30;
        //Derived
        var insetFactor = 0.1;
        var brInsetLeft = busInitX + insetFactor * busInitLength;
        var brInsetRight = busInitX + (1 - insetFactor) * busInitLength - branchWidth;
        //Selection box
        var selectWidth = 40;
        //Counts
        var busCount = this.getCountShapesOfType('bus');
        var brCount = this.getCountShapesOfType('branch');
        //BUS
        if (elementType == 'bus') {
            //Place based on number of buses
            var y_1 = busInitY + branchInitLength * busCount;
            newShape = ({
                elementType: elementType,
                elementId: newElementId,
                xInner: busInitX,
                yInner: y_1,
                wInner: busInitLength,
                hInner: busWidth,
                xOuter: busInitX,
                yOuter: y_1 - (selectWidth - busWidth) / 2,
                wOuter: busInitLength,
                hOuter: selectWidth
            });
            //console.log(">>>" + (busInitX) + " " + (y + busWidth / 2))
        }
        //BRANCH
        else if (elementType == 'branch') {
            //From bus is top bus with min branch connections
            var busShapes = this.shapes.filter(function (s) { return s.elementType === 'bus'; });
            var busesByYPosDesc = busShapes.sort(function (a, b) { return a.yInner < b.yInner ? 1 : -1; });
            var topBusWithMinBr = busesByYPosDesc.reduce(function (p, c) {
                return _this.modelElementDataService.getConnectionCountBr(p.elementType) < _this.modelElementDataService.getConnectionCountBr(p.elementId)
                    ? p : c;
            });
            var y_2 = topBusWithMinBr.yInner + busWidth / 2;
            //Find next bus down if any (and remember sorted by y descending so need to go back in the array to go down)
            var brLength = branchInitLength;
            var fromBusIndex = busesByYPosDesc.indexOf(topBusWithMinBr);
            console.log(">>>>>" + fromBusIndex + ">>>>>>" + busesByYPosDesc.length + ">>>>>" + busesByYPosDesc[fromBusIndex - 1].elementId);
            if (busesByYPosDesc[fromBusIndex - 1]) {
                brLength = busesByYPosDesc[fromBusIndex - 1].yInner - topBusWithMinBr.yInner;
            }
            var branchCountNew = brCount + 1;
            var x = 0;
            //Inset from left or right
            if (branchCountNew % 2 == 1) {
                x = brInsetLeft;
            }
            else {
                x = brInsetRight;
            }
            ;
            //Y position
            //let y = (busInitY * Math.ceil(branchCountNew / 2)) + busWidth / 2;
            var xOuter = x - (selectWidth - branchWidth) / 2;
            //Flow direction Arrow
            var w = selectWidth;
            var arrowH = 15;
            var inset = 7;
            //const h = branchInitLength;
            //Capital letters means absolutely positioned, lower cases means relatively positioned.
            // path1 = `M 0 0 l ${w/2} ${arrowH} l ${w/2} ${-arrowH}`;
            // path2 = `M 0 ${arrowH + 2} l ${w/2} ${-arrowH} l ${w/2} ${arrowH}`;
            path1 = "M " + inset + " 0 l " + (w / 2 - inset) + " " + arrowH + " l " + (w / 2 - inset) + " " + -arrowH;
            path2 = "M " + inset + " " + (arrowH + 2) + " l " + (w / 2 - inset) + " " + -arrowH + " l " + (w / 2 - inset) + " " + arrowH;
            newShape = ({
                elementType: elementType,
                elementId: newElementId,
                xInner: x,
                yInner: y_2,
                wInner: branchWidth,
                hInner: brLength,
                xOuter: xOuter,
                yOuter: y_2,
                wOuter: selectWidth,
                hOuter: brLength,
                path1: path1,
                path2: path2
            });
        }
        //GEN & LOAD
        else if (elementType == 'gen' || elementType == 'load') {
            var genLoadCount = this.getCountShapesOfType('gen') + this.getCountShapesOfType('load');
            var h = genLoadLength;
            var w = genLoadWidth;
            var x_1 = busInitX + busInitLength / 2 - w / 2;
            //Y position
            var y = busInitY - h;
            if (busCount > 1 && genLoadCount > 0) { //position on last bus
                y = busInitY + (branchInitLength * (busCount - 1)) - h;
            }
            var path1;
            var path2;
            if (elementType == 'gen') {
                //gen sine wave
                var sineStartX = 6;
                var sineStartY = w / 2;
                var sineW = w - 2 * sineStartX;
                path1 = "M " + sineStartX + " " + sineStartY + "           q " + sineW / 4 + " " + -sineW / 2 + " " + sineW / 2 + " 0";
                path2 = "M " + (sineStartX + sineW / 2) + " " + sineStartY + " q " + sineW / 4 + " " + sineW / 2 + "  " + sineW / 2 + " 0";
            }
            else if (elementType == 'load') {
                //load arrow
                var arrowH = 10;
                //<path id="lineAB" d="M 20 100 l 0 -98 m -18 18 l 18 -18 l 18 18"
                path1 = "M " + w / 2 + " " + h + " l 0 " + -(h - 2) + " m " + -arrowH + " " + arrowH + " l " + arrowH + " " + -arrowH + " l " + arrowH + " " + arrowH;
            }
            console.log("path1: " + path1 + " path2: " + path2);
            // this.shapes.push({
            newShape = ({
                elementType: elementType,
                elementId: newElementId,
                xInner: x_1,
                yInner: y,
                wInner: w,
                hInner: h,
                xOuter: x_1 - (selectWidth - w) / 2,
                yOuter: y,
                wOuter: selectWidth,
                hOuter: h,
                path1: path1,
                path2: path2
            });
        }
        //ISLAND & MATHMODEL
        else if (elementType == 'island' || elementType == 'mathModel') {
            var xDistFromBus = 22;
            var x_2 = busInitX + busInitLength + xDistFromBus;
            var y = 50;
            var margin = 6;
            var h = 55;
            var w = selectWidth + 10;
            if (elementType == 'island') {
                y = y + h + 10;
            }
            newShape = ({
                elementType: elementType,
                elementId: newElementId,
                xInner: x_2 + margin,
                yInner: y,
                wInner: w - 2 * margin,
                hInner: h,
                xOuter: x_2,
                yOuter: y,
                wOuter: w,
                hOuter: h
            });
        }
        this.shapes.push(newShape);
        this.selectedShapeId = newElementId;
        return newShape;
    };
    // getShapePoint(elementId: string): Point {
    //   const shape = this.shapes.find(s => s.elementId === elementId);
    //   if (shape) {
    //     return {x: shape.xInner, y: shape.yInner};
    //   }
    //   else {
    //     return {x:0, y:0};
    //   }
    // }
    ShapeService.prototype.applyDeltaX = function (deltaX, shape) {
        shape.xInner += deltaX;
        shape.xOuter += deltaX;
    };
    ShapeService.prototype.applyDeltaY = function (deltaY, shape) {
        shape.yInner += deltaY;
        shape.yOuter += deltaY;
    };
    ShapeService.prototype.applyDeltaW = function (deltaX, shape) {
        shape.wInner += deltaX;
        shape.wOuter += deltaX;
    };
    ShapeService.prototype.applyDeltaH = function (deltaY, shape) {
        shape.hInner += deltaY;
        shape.hOuter += deltaY;
    };
    ShapeService.prototype.isOverlap = function (shape1, shape2) {
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
    };
    //Convert the shape connectivity to model connectivity
    ShapeService.prototype.saveConnectivityToModel = function () {
        console.log("saveConnectivityToModel");
        //Non-bus elements reference back to the bus
        for (var _i = 0, _a = this.getShapesNotOfType('bus'); _i < _a.length; _i++) {
            var nonBusEl = _a[_i];
            var fromBus = undefined;
            var toBus = undefined;
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
            this.modelElementDataService.setPropertyForElement(nonBusEl.elementId, 'toBus', toBus);
            this.modelElementDataService.setPropertyForElement(nonBusEl.elementId, 'fromBus', fromBus);
        }
    };
    //Assign results to text fields of the shapes
    ShapeService.prototype.applyResultsToShapesText = function () {
        var _a;
        for (var _i = 0, _b = this.shapes; _i < _b.length; _i++) {
            var shape = _b[_i];
            _a = this.modelElementDataService.getTextFromElementResults(shape.elementId), shape.text1 = _a[0], shape.text2 = _a[1], shape.text3 = _a[2], shape.text4 = _a[3];
        }
    };
    ShapeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ShapeService);
    return ShapeService;
}());
exports.ShapeService = ShapeService;
