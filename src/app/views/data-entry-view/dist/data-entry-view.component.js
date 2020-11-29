"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DataEntryViewComponent = void 0;
var core_1 = require("@angular/core");
var DataEntryViewComponent = /** @class */ (function () {
    function DataEntryViewComponent(
    // private modelElementService: ModelElementService,
    modelElementDataService, modelElementDefService, router, route, mathModelDefService
    // private shapeService: ShapeService) 
    ) {
        var _this = this;
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
        this.router = router;
        this.route = route;
        this.mathModelDefService = mathModelDefService;
        this.doConstraintDefs = false;
        this.doConstraintComps = false;
        this.doDataEntry = false;
        this.formNames = [];
        this.formDefaults = [];
        this.formElementIds = [];
        this.formPropertyIds = [];
        this.pageTitle = "";
        this.ccArray = [[]];
        this.cdArray = [];
        route.params.subscribe(function (params) { _this.idOfDataEntryObject = params['id']; });
    }
    DataEntryViewComponent.prototype.ngOnInit = function () {
        var id = this.idOfDataEntryObject;
        console.log("GOT ID ", id); //this.idOfDataEntryObject);
        if (id === "model-def") {
            this.doConstraintDefs = true;
            this.populateFromConstraintDefs();
        }
        else if (id.includes("constraintComp")) {
            this.doConstraintComps = true;
            var startPos = id.indexOf("?") + 1;
            this.populateFromConstraintComps(id.substr(startPos));
        }
        else {
            this.doDataEntry = true;
            this.populateFormFromElementId(id);
        }
    };
    //Call this component from itself
    //https://stackoverflow.com/questions/52389376/angular-6-how-to-reload-current-page/52492081
    DataEntryViewComponent.prototype.reload = function (target) {
        console.log("##" + target);
        // this.populateFromConstraintComps(target);
        this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
        this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate(['../' + target], { relativeTo: this.route });
        this.router.navigate(['../constraintComp?' + target], { relativeTo: this.route });
    };
    DataEntryViewComponent.prototype.reloadMain = function () {
        this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
        this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate(['../' + target], { relativeTo: this.route });
        this.router.navigate(['../model-def'], { relativeTo: this.route });
    };
    //Constraint Defintions
    DataEntryViewComponent.prototype.setIncludeStatus = function (constraintName, status) {
        console.log(">>>" + constraintName + " >>>" + status);
    };
    DataEntryViewComponent.prototype.getIncludeStatus = function (constraintName) {
        return true;
    };
    //Constraint Components
    DataEntryViewComponent.prototype.getFactorStatus = function (factorId) {
        return this.mathModelDefService.factorIsEnabled(factorId);
    };
    DataEntryViewComponent.prototype.setFactorStatus = function (factorId, isEnabled) {
        return this.mathModelDefService.setFactorStatus(factorId, isEnabled);
    };
    //===SUBMIT===
    DataEntryViewComponent.prototype.onSubmit = function (form) {
        var _this = this;
        //The form returns an object
        console.log('you submitted value:', form);
        //Extract the data from the object
        //Fields where no data has been entered are empty strings, so we don't update those
        if (this.formNames) {
            this.formNames.forEach(function (formName, index) {
                var formValue = Object(form)[formName];
                if (formValue && formValue != "") {
                    // let newValue = Object(form)[propertyType];
                    console.log(">>>value>>>" + formName + ":" + formValue);
                    var propertyId = _this.formPropertyIds[index];
                    var elementId = _this.formElementIds[index];
                    _this.modelElementDataService.setPropertyForElement(elementId, propertyId, formValue);
                }
            });
        }
        //Submit also navigates back
        this.router.navigate(['/network-builder-component']);
    };
    DataEntryViewComponent.prototype.populateFromConstraintDefs = function () {
        console.log("populateFromConstraintDefs");
        var constraintDefs = this.mathModelDefService.getConstraintDefsAll();
        for (var _i = 0, constraintDefs_1 = constraintDefs; _i < constraintDefs_1.length; _i++) {
            var constraintDef = constraintDefs_1[_i];
            console.log(">>>" + constraintDef.constraintType);
            this.formNames.push(constraintDef.constraintType);
        }
    };
    DataEntryViewComponent.prototype.populateFromConstraintComps = function (constraintType) {
        console.log("populateFromConstraintComps");
        this.pageTitle = "Constraint: " + constraintType;
        var constraintDef = this.mathModelDefService.getConstraintDef(constraintType);
        var constraintComps = this.mathModelDefService.getConstraintComps(constraintType);
        var a = [];
        this.cdArray.push("parent elementType: " + constraintDef.elementType);
        this.cdArray.push("inequality: " + constraintDef.inEquality);
        if (constraintDef.rhsProperty != "") {
            this.cdArray.push("rhsProperty: " + constraintDef.rhsProperty);
        }
        else {
            this.cdArray.push("rhsValue: " + constraintDef.rhsValue);
        }
        //If the parent has a var in the equation
        if (constraintDef.varType != "") {
            // this.cdArray.push(constraintDef.elementType + "." + constraintDef.varType)
            // const mult = constraintDef.factorValue.toString() + " x ";
            // if (constraintDef.factorProperty != "") {a.push(mult + constraintDef.factorProperty)};
            this.formNames.push(constraintDef.elementType + "." + constraintDef.varType);
            var a = [];
            a.push("[parent var]");
            var factors = constraintDef.factorValue.toString() + " x ";
            if (constraintDef.factorProperty != "") {
                factors += constraintDef.factorProperty;
            }
            ;
            a.push(factors);
            this.ccArray.push(a);
        }
        //The child vars in the equation
        for (var _i = 0, constraintComps_1 = constraintComps; _i < constraintComps_1.length; _i++) {
            var constraintComp = constraintComps_1[_i];
            this.formNames.push(constraintComp.elementType + "." + constraintComp.varType);
            console.log(">>>" + constraintComp.varType);
            var a = [];
            a.push("[" + constraintComp.propertyMap + "]");
            var factors = constraintComp.factorValue.toString() + " x ";
            if (constraintComp.factorProperty != "") {
                factors += constraintComp.factorProperty;
            }
            ;
            if (constraintComp.factorParentProperty != "") {
                factors += constraintComp.factorParentProperty;
            }
            ;
            a.push(factors);
            this.ccArray.push(a);
            // this.formNames.push("=========");
        }
    };
    DataEntryViewComponent.prototype.populateFormFromElementId = function (elementId) {
        //Get the element i.d. from the route
        // const elementId = this.route.snapshot.paramMap.get('elementId');
        var selectedElement = this.modelElementDataService.getModelElementForId(elementId);
        if (selectedElement) {
            this.constraintStrings = selectedElement.constraintStrings;
            console.log(">>> " + selectedElement.constraintStrings);
            var parentProperties = this.modelElementDefService.getPropertyTypesFor(selectedElement.elementType);
            this.populateFormFieldsFromProperties(parentProperties, selectedElement.elementId);
            //Get child records
            var childElements = this.modelElementDataService.getChildElements(elementId);
            for (var _i = 0, childElements_1 = childElements; _i < childElements_1.length; _i++) {
                var childElement = childElements_1[_i];
                var childProperties = this.modelElementDefService.getPropertyTypesFor(childElement.elementType);
                this.populateFormFieldsFromProperties(childProperties, childElement.elementId);
            }
        }
    };
    DataEntryViewComponent.prototype.populateFormFieldsFromProperties = function (propertyIds, elementId) {
        for (var _i = 0, propertyIds_1 = propertyIds; _i < propertyIds_1.length; _i++) {
            var propertyId = propertyIds_1[_i];
            if (this.modelElementDefService.propertyIsVisible(propertyId)) {
                //Name/Title
                this.formNames.push(elementId + "-" + propertyId);
                //Default value
                var value = this.modelElementDataService.getValueForElementProperty(elementId, propertyId);
                this.formDefaults.push(value);
                //PropertyId
                this.formPropertyIds.push(propertyId);
                //ElementId
                this.formElementIds.push(elementId);
                console.log(elementId + "-" + propertyId + "-value:" + value);
            }
            else {
                console.log(propertyId + ": not visible");
            }
        }
    };
    DataEntryViewComponent = __decorate([
        core_1.Component({
            selector: 'app-data-entry-view',
            templateUrl: './data-entry-view.component.html',
            styleUrls: ['./data-entry-view.component.css']
        })
    ], DataEntryViewComponent);
    return DataEntryViewComponent;
}());
exports.DataEntryViewComponent = DataEntryViewComponent;
