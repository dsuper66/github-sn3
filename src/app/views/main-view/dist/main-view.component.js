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
    function MainViewComponent(
    // private shapeService: ShapeService,
    // private modelElementService: ModelElementService,
    modelElementDataService, modelElementDefService, mathModelDefService, solverCallService) {
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
        this.mathModelDefService = mathModelDefService;
        this.solverCallService = solverCallService;
        // shapes: Shape[] = [];
        this.solverJsonInput = "";
        this.solverResults = "";
    }
    MainViewComponent.prototype.ngOnInit = function () {
        this.getModelData();
    };
    MainViewComponent.prototype.jsonStart = function (sectionName) {
        return JSON.stringify(sectionName) + ":[";
    };
    MainViewComponent.prototype.replaceLastChar = function (stringIn, expectedLastChar, newLastChar) {
        var returnString = stringIn;
        if (stringIn.length > 0) {
            //Check that the last char is what we expect
            if (stringIn.substring(stringIn.length - 1, stringIn.length) === expectedLastChar) {
                //Replace the last char
                returnString = stringIn.substring(0, stringIn.length - 1) + newLastChar;
            }
            else {
                //Add the last char
                returnString = stringIn + newLastChar;
            }
        }
        return returnString;
    };
    MainViewComponent.prototype.jsonAddPair = function (key, value) {
        // JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
        return JSON.stringify(key) + ":" + JSON.stringify(value) + ",";
    };
    MainViewComponent.prototype.getModelData = function () {
        var _this = this;
        //Open JSON
        var jString = "{";
        //Elements
        //Start elements array
        // var jString = "{" + JSON.stringify("elements") + ":[";
        jString += this.jsonStart("elements");
        //Individual Elements    
        var modelElements = this.modelElementDataService.getModelElements();
        //Don't write an element that has missing properties
        var modelElementsExcluded = modelElements.filter(function (element) { return ((Object.keys(element.properties).length
            != _this.modelElementDefService.getPropertyCount(element.elementType))); });
        // && (element.properties.filter(property => (property['parentId'] != undefined)))
        for (var _i = 0, modelElementsExcluded_1 = modelElementsExcluded; _i < modelElementsExcluded_1.length; _i++) {
            var modelElement = modelElementsExcluded_1[_i];
            console.log(">>>Excluded:" + modelElement.elementId);
        }
        //Write all the elements
        for (var _a = 0, _b = modelElements.filter(function (element) { return element.includeInModel; }); _a < _b.length; _a++) {
            var modelElement = _b[_a];
            console.log("write: " + modelElement.elementId);
            //Start this Element
            jString += "{";
            //ID
            jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
            //Element type
            jString += JSON.stringify("elementType") + ":" + JSON.stringify(modelElement.elementType) + ",";
            //Properties 
            jString += JSON.stringify("properties") + ":{";
            for (var _c = 0, _d = this.modelElementDefService.getPropertyTypesFor(modelElement.elementType); _c < _d.length; _c++) {
                var propertyType = _d[_c];
                var value = this.modelElementDataService.getValueForElementProperty(modelElement.elementId, propertyType);
                //Don't write undefined values, e.g., tranches with no data
                if (value != undefined) {
                    jString += JSON.stringify(propertyType) + ":" + JSON.stringify(value) + ",";
                }
            }
            //Remove the last comma and close properties object
            jString = this.replaceLastChar(jString, ",", "}");
            //Close element object
            jString += "},";
        }
        //Remove last comma and close Elements list
        jString = this.replaceLastChar(jString, ",", "]");
        // jString = jString.substring(0, jString.length - 1) + "]}";
        //Next "object"...  Elements "," ConstraintDefs
        jString += ",";
        //ConstraintDefs
        jString += this.jsonStart("constraintDefs");
        var constraintDefs = this.mathModelDefService.getConstraintDefs();
        for (var _e = 0, constraintDefs_1 = constraintDefs; _e < constraintDefs_1.length; _e++) {
            var constraintDef = constraintDefs_1[_e];
            //Start ConstraintDef
            jString += "{";
            jString += this.jsonAddPair("constraintId", constraintDef.constraintId);
            jString += this.jsonAddPair("elementType", constraintDef.elementType);
            jString += this.jsonAddPair("varType", constraintDef.varType);
            jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
            jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);
            jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue);
            jString += this.jsonAddPair("multProperty", constraintDef.multProperty);
            //Remove last comma and close constraintDef object
            jString = this.replaceLastChar(jString, ",", "},");
        }
        //Remove last comma, close constraintDefs list
        jString = this.replaceLastChar(jString, ",", "]");
        //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps
        jString += ",";
        //ConstraintComps
        jString += this.jsonStart("constraintComps");
        var constraintComps = this.mathModelDefService.getConstraintComps();
        for (var _f = 0, constraintComps_1 = constraintComps; _f < constraintComps_1.length; _f++) {
            var constraintComp = constraintComps_1[_f];
            //Start ConstraintComps
            jString += "{";
            jString += this.jsonAddPair("constraintId", constraintComp.constraintId);
            jString += this.jsonAddPair("elementType", constraintComp.elementType);
            jString += this.jsonAddPair("propertyMap", constraintComp.propertyMap);
            jString += this.jsonAddPair("varType", constraintComp.varType);
            jString += this.jsonAddPair("multParentProperty", constraintComp.multParentProperty);
            jString += this.jsonAddPair("multValue", constraintComp.multValue);
            jString += this.jsonAddPair("multProperty", constraintComp.multProperty);
            //Remove last comma and close constraintComp object
            jString = this.replaceLastChar(jString, ",", "},");
        }
        //Remove last comma, close constraintComps list
        jString = this.replaceLastChar(jString, ",", "]");
        //Close JSON
        jString += "}";
        this.solverJsonInput = jString;
        //Send the model to the solver
        var solverInput = { inputJson: jString };
        this.solverCallService
            .sendModelToSolver(solverInput)
            .subscribe(function (solverResults) {
            console.log("SOLVER RESULTS:" + solverResults);
            _this.solverResults = solverResults;
        });
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
