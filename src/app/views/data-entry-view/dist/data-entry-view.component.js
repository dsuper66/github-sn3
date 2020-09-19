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
    modelElementDataService, modelElementDefService, router, route
    // private shapeService: ShapeService) 
    ) {
        var _this = this;
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
        this.router = router;
        this.route = route;
        // myGroup = new FormGroup({
        //   firstName: new FormControl()
        // });
        // propertiesFormArray: FormControl[] = [];
        this.formNames = [];
        this.formDefaults = [];
        this.formElementIds = [];
        this.formPropertyIds = [];
        route.params.subscribe(function (params) { _this.idOfDataEntryObject = params['id']; });
    }
    DataEntryViewComponent.prototype.ngOnInit = function () {
        console.log("GOT ID ", this.idOfDataEntryObject);
        this.populateFormFromElementId(this.idOfDataEntryObject);
    };
    //To get the data back from the data-entry form
    // dataIds: string[] = [];
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
                    // let newValue = Object(form)[propertyTypeId];
                    console.log(">>>value>>>" + formName + ":" + formValue);
                    var propertyId = _this.formPropertyIds[index];
                    var elementId = _this.formElementIds[index];
                    _this.modelElementDataService.setPropertyForElement(elementId, propertyId, formValue);
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
    DataEntryViewComponent.prototype.populateFormFromElementId = function (elementId) {
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
            this.populateFormFieldsFromProperties(parentProperties, selectedElement.elementId);
            //Populate the property fields
            // for (const parentPropertyId of parentProperties) {
            //   if (this.modelElementDataService.propertyIsVisible(parentPropertyId)) {
            //     //Data Id
            //     this.dataIds.push(parentPropertyId);
            //     //Title
            //     this.formTitles.push(parentPropertyId);
            //     //Default value
            //     const value = this.modelElementDataService.getValueForElementProperty(elementId, parentPropertyId);
            //     this.formDefaults.push(value);
            //     console.log(parentPropertyId + ": current value:" + value);
            //   }
            //   else {
            //     console.log(parentPropertyId + ": not visible")
            //   }
            // }
            //Get child records
            var childElements = this.modelElementDataService.getChildIdsForElementId(elementId);
            for (var _i = 0, childElements_1 = childElements; _i < childElements_1.length; _i++) {
                var childElement = childElements_1[_i];
                var childProperties = this.modelElementDataService.getPropertyTypeIdsFor(childElement.elementTypeId);
                this.populateFormFieldsFromProperties(childProperties, childElement.elementId);
                // for (const childPropertyId of childProperties) {
                //   if (this.modelElementDataService.propertyIsVisible(childPropertyId)) {
                //     //Data Id
                //     this.dataIds.push(childPropertyId);
                //     //Title
                //     this.formTitles.push(childPropertyId + "[" + childElement.elementId + "]");
                //     //Default value
                //     const value = this.modelElementDataService.getValueForElementProperty(childElement.elementId, childPropertyId);
                //     this.formDefaults.push(value);
                //   }
                //   else {
                //     console.log(childPropertyId + ": not visible")
                //   }
                // }
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
    DataEntryViewComponent.prototype.populateFormFieldsFromProperties = function (propertyIds, elementId) {
        for (var _i = 0, propertyIds_1 = propertyIds; _i < propertyIds_1.length; _i++) {
            var propertyId = propertyIds_1[_i];
            if (this.modelElementDefService.propertyIsVisible(propertyId)) {
                //Data Id
                // this.dataIds.push(propertyId);
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
