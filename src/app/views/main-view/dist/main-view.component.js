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
    modelElementDataService, mathModelDataService, solverCallService) {
        this.modelElementDataService = modelElementDataService;
        this.mathModelDataService = mathModelDataService;
        this.solverCallService = solverCallService;
        // shapes: Shape[] = [];
        this.solverJsonInput = "";
        this.solverResults = "";
    }
    MainViewComponent.prototype.ngOnInit = function () {
        this.getModelData();
    };
    MainViewComponent.prototype.getModelData = function () {
        var _this = this;
        //Start elements array
        var jString = "{" + JSON.stringify("elements") + ":[";
        //Individual Elements    
        var modelElements = this.modelElementDataService.getModelElements();
        for (var _i = 0, _a = modelElements.filter(function (element) { return element.visible; }); _i < _a.length; _i++) {
            var modelElement = _a[_i];
            //Start Element
            jString += "{";
            //ID
            jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
            //Element type
            jString += JSON.stringify("elementTypeId") + ":" + JSON.stringify(modelElement.elementTypeId) + ",";
            //Properties 
            jString += JSON.stringify("properties") + ":{";
            for (var _b = 0, _c = this.modelElementDataService.getPropertyTypeIdsFor(modelElement.elementTypeId); _b < _c.length; _b++) {
                var propertyTypeId = _c[_b];
                var value = this.modelElementDataService.getValueForElementProperty(modelElement.elementId, propertyTypeId);
                jString += JSON.stringify(propertyTypeId) + ":" + JSON.stringify(value) + ",";
            }
            //Close properties object and close element object
            jString = jString.substring(0, jString.length - 1) + "}},";
        }
        //Close elements array
        jString = jString.substring(0, jString.length - 1) + "]}";
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
