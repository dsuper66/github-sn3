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
    function DataEntryViewComponent(modelElementService, modelElementDataService, router, route
    // private shapeService: ShapeService) 
    ) {
        var _this = this;
        this.modelElementService = modelElementService;
        this.modelElementDataService = modelElementDataService;
        this.router = router;
        this.route = route;
        // myGroup = new FormGroup({
        //   firstName: new FormControl()
        // });
        // propertiesFormArray = new FormArray([]);
        this.propertiesFormArray = [];
        this.formTitles = [];
        this.formDefaults = [];
        this.formElementId = [];
        this.formPropertyId = [];
        //To get the data back from the data-entry form
        this.dataIds = [];
        route.params.subscribe(function (params) { _this.idOfDataEntryObject = params['id']; });
    }
    DataEntryViewComponent.prototype.ngOnInit = function () {
        console.log("GOT ID ", this.idOfDataEntryObject);
        this.populateFormForElementId(this.idOfDataEntryObject);
    };
    // private selectedShape: Shape;
    // private elementId = "none selected";
    DataEntryViewComponent.prototype.onSubmit = function (form) {
        var _this = this;
        //The form returns an object
        console.log('you submitted value:', form);
        //Extract the data from the object
        //Fields where no data has been entered are empty strings, so we don't update those
        if (this.dataIds) {
            // for (let propertyTypeId of this.dataIds.filter(id => Object(form)[id] != "")) {
            this.dataIds.forEach(function (propertyTypeId, index) {
                var formValue = Object(form)[propertyTypeId];
                if (formValue && formValue != "") {
                    var newValue = Object(form)[propertyTypeId];
                    console.log(">>>value>>>" + propertyTypeId + ":" + newValue);
                    _this.modelElementDataService.setValueForElementProperty(_this.idOfDataEntryObject, propertyTypeId, newValue);
                }
            });
        }
        //Submit also navigates back
        this.router.navigate(['/network-builder-component']);
        // console.log('resistance:' , document.getElementById("resistance")[0].value)
        // console.log('resistance:' , form["resistance"]);
        // let items = form as {[property: string]: any};
        // for (let formItem of Object.values(form.controls) as {key:string,value:any}) {
        //   console.log("value:" + formItem.value)
        // form.forEach(element => {
        //   console.log(element)
        // }); 
        // for (const name in form.controls) {
        //     console.log ("ppp");
        // }
    };
    DataEntryViewComponent.prototype.populateFormForElementId = function (elementId) {
        //Get the element i.d. from the route
        // const elementId = this.route.snapshot.paramMap.get('elementId');
        // const elementId = this.route.snapshot.paramMap.get('elementId');
        // console.log(">>>Element ID:" + elementId 
        //   + " name:" + this.modelElementService.getElementName(elementId));
        // this.modelData.setValue(elementId);
        // this.selectedShape = this.shapeService.getSelectedShape();
        var selectedElement = this.modelElementDataService.getModelElementForId(elementId);
        if (selectedElement) {
            console.log(">>> " + selectedElement.elementTypeId);
            var parentProperties = this.modelElementDataService.getPropertyTypeIdsFor(selectedElement.elementTypeId);
            // this.dataIds = parentProperties;
            // console.log(this.dataIds)
            //Populate the property fields
            // .filter(property => property['visible'] === true 
            for (var _i = 0, parentProperties_1 = parentProperties; _i < parentProperties_1.length; _i++) {
                var parentPropertyId = parentProperties_1[_i];
                if (this.modelElementDataService.propertyIsVisible(parentPropertyId)) {
                    //Data Id
                    this.dataIds.push(parentPropertyId);
                    //Title
                    this.formTitles.push(parentPropertyId);
                    //Default value
                    var value = this.modelElementDataService.getValueForElementProperty(elementId, parentPropertyId);
                    this.formDefaults.push(value);
                    console.log(parentPropertyId + ": current value:" + value);
                }
                else {
                    console.log(parentPropertyId + ": not visible");
                }
            }
            //Get child records
            var childElements = this.modelElementDataService.getChildIdsForElementId(elementId);
            for (var _a = 0, childElements_1 = childElements; _a < childElements_1.length; _a++) {
                var childElement = childElements_1[_a];
                // console.log("#####" + childElement.elementId);
                var childProperties = this.modelElementDataService.getPropertyTypeIdsFor(childElement.elementTypeId);
                // this.dataIds.push(childElement.elementTypeId);
                for (var _b = 0, childProperties_1 = childProperties; _b < childProperties_1.length; _b++) {
                    var childPropertyId = childProperties_1[_b];
                    if (this.modelElementDataService.propertyIsVisible(childPropertyId)) {
                        //Data Id
                        this.dataIds.push(childPropertyId);
                        //Title
                        this.formTitles.push(childPropertyId + "[" + childElement.elementId + "]");
                        //Default value
                        var value = this.modelElementDataService.getValueForElementProperty(childElement.elementId, childPropertyId);
                        this.formDefaults.push(value);
                    }
                    else {
                        console.log(childPropertyId + ": not visible");
                    }
                }
            }
            // console.log(">>>mm>>>" + indexedArray);
            //   this.myGroup = this.fb.group({
            //     'connId1': ['none'],
            //     'connId2':['none'],
            //     'resistance':['none'] });
            // }
            // this.myGroup = this.fb.group({
            //   indexedArray });
            // }
            // this.modelData.setValue(this.elementId);
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
