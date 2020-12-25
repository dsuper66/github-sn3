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
    function DataEntryViewComponent(modelElementDataService, modelElementDefService, router, route, settingsService, solverCallService, mathModelDefService) {
        var _this = this;
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
        this.router = router;
        this.route = route;
        this.settingsService = settingsService;
        this.solverCallService = solverCallService;
        this.mathModelDefService = mathModelDefService;
        this.doJSONModel = false;
        this.doSolverOut = false;
        this.doElementDefs = false;
        this.doConstraintDefs = false;
        this.doConstraintComps = false;
        this.doDataEntry = false;
        this.formNames = [];
        this.formDefaults = [];
        this.fieldRefIdParent = [];
        this.fieldRefIdChild = [];
        this.jsonModel = "";
        this.solverOutString = "";
        this.pageTitle = "";
        //Constraint Defs
        this.cdArray = [];
        this.ccArray = [[]];
        //Data - data entry and results
        this.constraintString = "";
        this.resultString = "";
        route.params.subscribe(function (params) { _this.idOfDataEntryObject = params['id']; });
    }
    DataEntryViewComponent.prototype.ngOnInit = function () {
        var id = this.idOfDataEntryObject;
        console.log("GOT ID ", id); //this.idOfDataEntryObject);
        if (id === "element-def") {
            this.doElementDefs = true;
            this.populateFromElementDefs();
        }
        else if (id === "model-def") {
            this.doConstraintDefs = true;
            this.populateFromConstraintDefs();
        }
        else if (id.includes("constraintComp")) {
            this.doConstraintComps = true;
            var startPos = id.indexOf("?") + 1;
            this.populateFromConstraintComps(id.substr(startPos));
        }
        else if (id === "json-model") {
            this.doJSONModel = true;
            this.jsonModel = this.solverCallService.solverJsonInput;
        }
        else if (id === "solver-out") {
            this.doSolverOut = true;
            this.solverOutString = this.solverCallService.solverResultString;
        }
        else {
            this.doDataEntry = true;
            this.populateFromElementId(id);
        }
    };
    //Call this component from itself to display something different
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
                    if (_this.doDataEntry) {
                        var elementId = _this.fieldRefIdParent[index];
                        var propertyId = _this.fieldRefIdChild[index];
                        _this.modelElementDataService.setPropertyForElement(elementId, propertyId, formValue);
                    }
                    else if (_this.doElementDefs) {
                        var elementType = _this.fieldRefIdParent[index];
                        var propertyType = _this.fieldRefIdChild[index];
                        _this.modelElementDefService.setDefaultValue(elementType, propertyType, formValue);
                    }
                }
            });
        }
        //Submit also navigates back
        this.router.navigate(['/network-builder-component']);
    };
    //Element Defs  
    DataEntryViewComponent.prototype.populateFromElementDefs = function () {
        this.pageTitle = "Property Defaults";
        for (var _i = 0, _a = this.modelElementDefService.getDefaultSettingsAll(); _i < _a.length; _i++) {
            var propertyDef = _a[_i];
            this.formNames.push(propertyDef.elementType + "-" + propertyDef.propertyType);
            this.formDefaults.push(propertyDef.defaultValue);
            this.fieldRefIdParent.push(propertyDef.elementType);
            this.fieldRefIdChild.push(propertyDef.propertyType);
        }
    };
    //Constraint Defs - Parent
    DataEntryViewComponent.prototype.populateFromConstraintDefs = function () {
        this.pageTitle = "Constraint Definitions";
        console.log("populateFromConstraintDefs");
        var constraintDefs = this.mathModelDefService.getConstraintDefsAll();
        for (var _i = 0, constraintDefs_1 = constraintDefs; _i < constraintDefs_1.length; _i++) {
            var constraintDef = constraintDefs_1[_i];
            console.log(">>>" + constraintDef.constraintType);
            this.formNames.push(constraintDef.constraintType);
        }
    };
    //Constraint Defs - Components
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
    DataEntryViewComponent.prototype.populateFromElementId = function (elementId) {
        var selectedElement = this.modelElementDataService.getModelElementForId(elementId);
        if (selectedElement) {
            //Properties for this element
            var parentProperties = this.modelElementDefService.getPropertyTypesFor(selectedElement.elementType);
            this.populateFormFieldsFromProperties(parentProperties, selectedElement.elementId);
            //Properties for child elements
            var childElements = this.modelElementDataService.getChildElements(elementId);
            for (var _i = 0, childElements_1 = childElements; _i < childElements_1.length; _i++) {
                var childElement = childElements_1[_i];
                var childProperties = this.modelElementDefService.getPropertyTypesFor(childElement.elementType);
                this.populateFormFieldsFromProperties(childProperties, childElement.elementId);
            }
            //Constraint string
            if (selectedElement.constraintString) {
                this.constraintString = selectedElement.constraintString;
            }
            console.log(">>> " + selectedElement.constraintString);
            //Results string
            if (selectedElement.resultString) {
                this.resultString = selectedElement.resultString;
            }
        }
    };
    //Data entry fields (called from Data above)
    DataEntryViewComponent.prototype.populateFormFieldsFromProperties = function (propertyIds, elementId) {
        var showAllProperties = this.settingsService.getStatus("showHiddenProperties");
        for (var _i = 0, propertyIds_1 = propertyIds; _i < propertyIds_1.length; _i++) {
            var propertyId = propertyIds_1[_i];
            if (showAllProperties || this.modelElementDefService.propertyIsVisible(propertyId)) {
                //Name/Title
                this.formNames.push(elementId + "-" + propertyId);
                //PropertyId
                this.fieldRefIdChild.push(propertyId);
                //ElementId (for assigning any data entry)
                this.fieldRefIdParent.push(elementId);
                //Default value
                var defaultValue = this.modelElementDataService.getValueForElementProperty(elementId, propertyId);
                this.formDefaults.push(defaultValue);
                console.log(elementId + "-" + propertyId + "-value:" + defaultValue);
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
