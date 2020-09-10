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
        //Initial values
        this.branchInitLength = 100;
        this.busInitX = 50;
        this.busInitY = 100;
        this.busInitLength = 120;
        //Standard values
        this.branchWidth = 5;
        this.busWidth = 14;
        this.genLoadLength = 42;
        this.genLoadWidth = 30;
        //Selection box
        this.selectWidth = 40;
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
    //Delete
    ShapeService.prototype.deleteShapeWithId = function (shapeIdToDelete) {
        this.shapes = this.shapes.filter(function (shape) { return shape.elementId != shapeIdToDelete; });
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
        var filtered = this.shapes.filter(function (shape) { return shape.elementTypeId === elementType; });
        // for (let element of filtered) {
        //   console.log("shapes of type:" + elementType + " = " + element.elementId);
        // }
        return filtered;
    };
    //...and not of type
    ShapeService.prototype.getShapesNotOfType = function (elementType) {
        return this.shapes.filter(function (shape) { return shape.elementTypeId != elementType; });
    };
    ShapeService.prototype.getCountShapesOfType = function (elementType) {
        return this.getShapesOfType(elementType).length;
        //return this.shapes.filter(shape => shape.elementType === elementType).length;
    };
    //Add a shape
    ShapeService.prototype.addShape = function (elementType) {
        //Add the element and get back the i.d.
        var newElementId = this.modelElementService.addModelElement(elementType);
        //For deciding placement
        //let count = this.shapes.filter(shape => shape.elementType === elementType).length;
        console.log(newElementId + ":" + elementType + " count:" + (this.getCountShapesOfType(elementType) + 1));
        var newShape = new shape_1.Shape;
        //BUS
        if (elementType == 'bus') {
            var y = this.busInitY * (1 + this.getCountShapesOfType('bus'));
            newShape = ({
                elementTypeId: elementType,
                elementId: newElementId,
                xInner: this.busInitX,
                yInner: y,
                wInner: this.busInitLength,
                hInner: this.busWidth,
                xOuter: this.busInitX,
                yOuter: y - (this.selectWidth - this.busWidth) / 2,
                wOuter: this.busInitLength,
                hOuter: this.selectWidth
            });
            console.log(">>>" + (this.busInitX) + " " + (y + this.busWidth / 2));
        }
        //BRANCH
        else if (elementType == 'branch') {
            var branchCountNew = this.getCountShapesOfType('branch') + 1;
            var x = 0;
            if (branchCountNew % 2 == 1) {
                x = this.busInitX + 0.2 * this.busInitLength;
            }
            else {
                x = this.busInitX + 0.8 * this.busInitLength - this.branchWidth;
            }
            ;
            var y = (this.busInitY * Math.ceil(branchCountNew / 2)) + this.busWidth / 2;
            // this.shapes.push({
            newShape = ({
                elementTypeId: elementType,
                elementId: newElementId,
                xInner: x,
                yInner: y,
                wInner: this.branchWidth,
                hInner: this.branchInitLength,
                xOuter: x - (this.selectWidth - this.branchWidth) / 2,
                yOuter: y,
                wOuter: this.selectWidth,
                hOuter: this.branchInitLength
            });
        }
        //GEN & LOAD
        else if (elementType == 'gen' || elementType == 'load') {
            var genLoadCount = this.getCountShapesOfType('gen') + this.getCountShapesOfType('load');
            var h = this.genLoadLength;
            var w = this.genLoadWidth;
            var x_1 = this.busInitX + this.busInitLength / 2 - w / 2;
            var y = (this.busInitY * (1 + genLoadCount)) - h;
            var path1;
            var path2;
            if (elementType == 'gen') {
                var sineStartX = 6;
                var sineStartY = w / 2;
                var sineW = w - 2 * sineStartX;
                path1 = "M " + sineStartX + " " + sineStartY + "           q " + sineW / 4 + " " + -sineW / 2 + " " + sineW / 2 + " 0";
                path2 = "M " + (sineStartX + sineW / 2) + " " + sineStartY + " q " + sineW / 4 + " " + sineW / 2 + "  " + sineW / 2 + " 0";
            }
            else if (elementType == 'load') {
                var arrowH = 10;
                //<path id="lineAB" d="M 20 100 l 0 -98 m -18 18 l 18 -18 l 18 18"
                path1 = "M " + w / 2 + " " + h + " l 0 " + -(h - 2) + " m " + -arrowH + " " + arrowH + " l " + arrowH + " " + -arrowH + " l " + arrowH + " " + arrowH;
            }
            console.log("path1: " + path1 + " path2: " + path2);
            // this.shapes.push({
            newShape = ({
                elementTypeId: elementType,
                elementId: newElementId,
                xInner: x_1,
                yInner: y,
                wInner: w,
                hInner: h,
                xOuter: x_1 - (this.selectWidth - w) / 2,
                yOuter: y,
                wOuter: this.selectWidth,
                hOuter: h,
                path1: path1,
                path2: path2
            });
        }
        this.shapes.push(newShape);
        this.selectedShapeId = newElementId;
        return newShape;
    };
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
    ShapeService.prototype.saveConnectivityToModel = function () {
        //Non-bus elements reference back to the bus
        for (var _i = 0, _a = this.getShapesNotOfType('bus'); _i < _a.length; _i++) {
            var nonBusEl = _a[_i];
            // var propertyTypeIds: {propertyTyepId:string,busId:string} [] = [];
            //load and gen... only have connId1
            if (nonBusEl.elementTypeId != 'branch' && nonBusEl.connId1) {
                //In terms of the load, the bus is a fromBus
                if (nonBusEl.elementTypeId === 'load') {
                    this.modelElementDataService.setValueForElementProperty(nonBusEl.elementId, 'fromBus', nonBusEl.connId1);
                }
                //...for a gen, the bus is a toBus
                else if (nonBusEl.elementTypeId === 'gen') {
                    this.modelElementDataService.setValueForElementProperty(nonBusEl.elementId, 'toBus', nonBusEl.connId1);
                }
            }
            //branch
            else if (nonBusEl.elementTypeId === 'branch') {
                var fromBus;
                var toBus;
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
                this.modelElementDataService.setValueForElementProperty(nonBusEl.elementId, 'toBus', toBus);
                this.modelElementDataService.setValueForElementProperty(nonBusEl.elementId, 'fromBus', fromBus);
            }
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
