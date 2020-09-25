"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.MainViewComponent = void 0;

var core_1 = require("@angular/core");

var MainViewComponent =
/** @class */
function () {
  function MainViewComponent( // private shapeService: ShapeService,
  // private modelElementService: ModelElementService,
  modelElementDataService, modelElementDefService, mathModelDefService, solverCallService) {
    this.modelElementDataService = modelElementDataService;
    this.modelElementDefService = modelElementDefService;
    this.mathModelDefService = mathModelDefService;
    this.solverCallService = solverCallService; // shapes: Shape[] = [];

    this.solverJsonInput = "";
    this.solverResults = "";
  }

  MainViewComponent.prototype.ngOnInit = function () {
    this.getModelData();
  };

  MainViewComponent.prototype.jsonStart = function (sectionName) {
    return JSON.stringify(sectionName) + ":[";
  };

  MainViewComponent.prototype.replaceLastChar = function (stringIn, newChar) {
    if (stringIn.length > 0) {
      return stringIn.substring(0, stringIn.length - 1) + newChar;
    } else {
      return stringIn;
    }
  };

  MainViewComponent.prototype.jsonAddPair = function (key, value) {
    // JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
    return JSON.stringify(key) + ":" + JSON.stringify(value) + ",";
  };

  MainViewComponent.prototype.getModelData = function () {
    var _this = this; //Open JSON


    var jString = "{"; //Elements
    //Start elements array
    // var jString = "{" + JSON.stringify("elements") + ":[";

    jString += this.jsonStart("elements"); //Individual Elements    

    var modelElements = this.modelElementDataService.getModelElements();

    for (var _i = 0, _a = modelElements.filter(function (element) {
      return element.visible;
    }); _i < _a.length; _i++) {
      var modelElement = _a[_i]; //Start Element

      jString += "{"; //ID

      jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ","; //Element type

      jString += JSON.stringify("elementType") + ":" + JSON.stringify(modelElement.elementType) + ","; //Properties 

      jString += JSON.stringify("properties") + ":{";

      for (var _b = 0, _c = this.modelElementDefService.getPropertyTypeIdsFor(modelElement.elementType); _b < _c.length; _b++) {
        var propertyType = _c[_b];
        var value = this.modelElementDataService.getValueForElementProperty(modelElement.elementId, propertyType); //Don't write undefined values, e.g., tranches with no data

        if (value != undefined) {
          jString += JSON.stringify(propertyType) + ":" + JSON.stringify(value) + ",";
        }
      } //Remove the last comma and close properties object and close element object
      // jString = jString.substring(0, jString.length - 1) + "}},";


      jString = this.replaceLastChar(jString, "}") + "},";
    } //Remove last comma and close Elements list


    jString = this.replaceLastChar(jString, "]"); // jString = jString.substring(0, jString.length - 1) + "]}";
    //Next "object"...  Elements "," ConstraintDefs

    jString += ","; //ConstraintDefs

    jString += this.jsonStart("constraintDefs");
    var constraintDefs = this.mathModelDefService.getConstraintDefs();

    for (var _d = 0, constraintDefs_1 = constraintDefs; _d < constraintDefs_1.length; _d++) {
      var constraintDef = constraintDefs_1[_d]; //Start ConstraintDef

      jString += "{";
      jString += this.jsonAddPair("constraintId", constraintDef.constraintId);
      jString += this.jsonAddPair("elementType", constraintDef.elementType);
      jString += this.jsonAddPair("varType", constraintDef.varType);
      jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
      jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);
      jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue); //Remove last comma and close constraintDef object

      jString = this.replaceLastChar(jString, "},");
    } //Remove last comma, close constraintDefs list


    jString = this.replaceLastChar(jString, "]"); //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps

    jString += ","; //ConstraintComps

    jString += this.jsonStart("constraintComps");
    var constraintComps = this.mathModelDefService.getConstraintComps();

    for (var _e = 0, constraintComps_1 = constraintComps; _e < constraintComps_1.length; _e++) {
      var constraintComp = constraintComps_1[_e]; //Start ConstraintComps

      jString += "{";
      jString += this.jsonAddPair("constraintId", constraintComp.constraintId);
      jString += this.jsonAddPair("elementType", constraintComp.elementType);
      jString += this.jsonAddPair("propertyMapToParent", constraintComp.propertyMapToParent);
      jString += this.jsonAddPair("varType", constraintComp.varType);
      jString += this.jsonAddPair("multParentProperty", constraintComp.multParentProperty);
      jString += this.jsonAddPair("multValue", constraintComp.multValue); //Remove last comma and close constraintComp object

      jString = this.replaceLastChar(jString, "},");
    } //Remove last comma, close constraintComps list


    jString = this.replaceLastChar(jString, "]"); //Close JSON

    jString += "}";
    this.solverJsonInput = jString; //Send the model to the solver

    var solverInput = {
      inputJson: jString
    };
    this.solverCallService.sendModelToSolver(solverInput).subscribe(function (solverResults) {
      console.log("SOLVER RESULTS:" + solverResults);
      _this.solverResults = solverResults;
    });
  };

  MainViewComponent = __decorate([core_1.Component({
    selector: 'app-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.css']
  })], MainViewComponent);
  return MainViewComponent;
}();

exports.MainViewComponent = MainViewComponent;