"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainViewComponent = void 0;
var core_1 = require("@angular/core");
var MainViewComponent = /** @class */ (function () {
    function MainViewComponent(shapeService, modelElementService) {
        this.shapeService = shapeService;
        this.modelElementService = modelElementService;
        this.shapes = [];
        this.modelJSON = "";
    }
    MainViewComponent.prototype.ngOnInit = function () {
        this.getModelData();
    };
    MainViewComponent.prototype.getModelData = function () {
        //Start element and array of elements
        var jString = "{" + JSON.stringify("elements") + ":[";
        var modelElements = this.modelElementService.getModelElements();
        for (var _i = 0, modelElements_1 = modelElements; _i < modelElements_1.length; _i++) {
            var modelElement = modelElements_1[_i];
            //ID
            jString += "{" + JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
            //Element type
            jString += JSON.stringify("elementTypeId") + ":" + JSON.stringify(modelElement.elementTypeId) + ",";
            //Properties
            jString += JSON.stringify("properties") + ":{";
            //Properties
            for (var _a = 0, _b = this.modelElementService.getPropertyTypeIdsOfElementType(modelElement.elementTypeId); _a < _b.length; _a++) {
                var propertyTypeId = _b[_a];
                var value = this.modelElementService.getValueForElementProperty(modelElement.elementId, propertyTypeId);
                jString += JSON.stringify(propertyTypeId) + ":" + JSON.stringify(value) + ",";
            }
            //Close properties array and element to prep for next element
            jString = jString.substring(0, jString.length - 1) + "}},";
        }
        //Close elements array and element
        jString = jString.substring(0, jString.length - 1) + "]}";
        this.modelJSON = jString;
    };
    MainViewComponent.prototype.getModelDataOld = function () {
        this.shapes = this.shapeService.getShapes();
        var modelData = [];
        // var jString2 = "";
        var jString = "{" + JSON.stringify("bus1") + ":{";
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            modelData.push({
                elementId: shape.elementId,
                busId1: (shape.connId1) ? shape.connId1 : "",
                busId2: (shape.connId2) ? shape.connId2 : ""
            });
            jString += JSON.stringify(shape.elementId)
                + ":" + JSON.stringify((shape.connId1) ? shape.connId1 : "") + ",";
            // jString2 += JSON.stringify({
            //   elementId: shape.elementId,
            //   elementType: shape.elementType,
            //   bus1: shape.connId1,
            //   bus2: shape.connId2
            // });
        }
        jString = jString.substring(0, jString.length - 1) + "}}";
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
    };
    MainViewComponent = __decorate([
        core_1.Component({
            selector: 'app-main-view',
            templateUrl: './main-view.component.html',
            styleUrls: ['./main-view.component.css']
        })
    ], MainViewComponent);
    return MainViewComponent;
}());
exports.MainViewComponent = MainViewComponent;
