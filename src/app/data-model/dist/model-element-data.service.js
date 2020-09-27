"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModelElementDataService = void 0;
var core_1 = require("@angular/core");
var ModelElementDataService = /** @class */ (function () {
    function ModelElementDataService(modelElementDefService) {
        this.modelElementDefService = modelElementDefService;
        this.modelElements = [];
        this.elementNextIndex = new Map();
        //Manually Added Child element defintions which will
        //cause child elements to be created automatically with parent
        //--------------------------------------------------
        //Tranches
        //--------
        //Bid Tranches associated with load
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Energy Tranches associated with gen
        this.modelElements.push({
            elementId: 'enOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'enOfferTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Reserve Tranches associated with gen
        this.modelElements.push({
            elementId: 'resOfferTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'gen' }, { 'childTypeId': 'resOfferTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Flow-Loss Tranches associated with branch
        this.modelElements.push({
            elementId: 'lossTrancheDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }
            ]),
            includeInModel: false
        });
        //Unrestricted Elements
        //---------------------
        this.modelElements.push({
            elementId: 'dirBranchDef', elementType: 'childDef',
            properties: this.makeDict([
                { 'parentType': 'branch' }, { 'childTypeId': 'dirBranch' }, { 'childCount': '2' }
            ]),
            includeInModel: false
        });
        //Static components of the model
        //mathModel has the objective as a variable
        this.modelElements.push({
            elementId: 'mathmodel001', elementType: 'mathModel',
            properties: {},
            includeInModel: true
        });
        //island has risk and reserve as variables 
        //(static for now, but will be based on connectivity, created by saveConnectivityToModel)
        this.modelElements.push({
            elementId: 'island001', elementType: 'island',
            properties: {},
            includeInModel: true
        });
    }
    ModelElementDataService.prototype.getIdForNewElementOfType = function (elementType) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementType] == undefined) {
            this.elementNextIndex[elementType] = 1;
        }
        var elementIndex = this.elementNextIndex[elementType];
        //Make the i.d.
        var newId = this.makeIdFromStringAndNumber(elementType, elementIndex);
        this.elementNextIndex[elementType] = elementIndex + 1;
        console.log("New Id:" + newId);
        return newId;
    };
    ModelElementDataService.prototype.makeIdFromStringAndNumber = function (idString, idNumber) {
        return idString + ("000" + idNumber).slice(-3);
    };
    //Make Dictionary from array of objects
    //https://stackoverflow.com/questions/43147696/unable-to-extract-object-values-in-typescript
    ModelElementDataService.prototype.makeDict = function (arrayOfMaps) {
        var dict = {};
        arrayOfMaps.forEach(function (obj) {
            Object.getOwnPropertyNames(obj).forEach(function (key) {
                var value = obj[key];
                //console.log(key + '>>>>' + value);
                dict[key] = value;
            });
        });
        return dict;
    };
    //===DATA===
    ModelElementDataService.prototype.addElement = function (elementId, elementType, properties) {
        this.modelElements.push({
            elementId: elementId,
            elementType: elementType,
            properties: properties,
            includeInModel: true
        });
    };
    //Child elements
    ModelElementDataService.prototype.getChildElementDefs = function (elementType) {
        return this.modelElements.filter(function (element) { return element.properties['parentType'] === elementType; });
    };
    ModelElementDataService.prototype.getChildElements = function (elementId) {
        return this.modelElements.filter(function (element) { return element.properties['parentId'] === elementId; });
    };
    //Test - get all properties of all
    ModelElementDataService.prototype.listAllElements = function (elementId) {
        for (var _i = 0, _a = this.modelElements; _i < _a.length; _i++) {
            var element = _a[_i];
            var propertyTypeIds = this.modelElementDefService.getPropertyTypesFor(element.elementType);
            for (var _b = 0, propertyTypeIds_1 = propertyTypeIds; _b < propertyTypeIds_1.length; _b++) {
                var propertyType = propertyTypeIds_1[_b];
                console.log("##>>" + element.elementId + " : " + propertyType + " : " + element.properties[propertyType]);
            }
        }
        return this.modelElements.filter(function (element) { return element.properties['parentId'] === elementId; });
    };
    ModelElementDataService.prototype.getModelElements = function () {
        return this.modelElements;
    };
    ModelElementDataService.prototype.getModelElementForId = function (elementId) {
        return this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
    };
    ModelElementDataService.prototype.getValueForElementProperty = function (elementId, propertyType) {
        var properties = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties;
        return properties[propertyType];
    };
    ModelElementDataService.prototype.getElementsWithPropertyValue = function (propertyType, value) {
        return this.modelElements.filter(function (element) { return element.properties[propertyType] === value; });
    };
    ModelElementDataService.prototype.setPropertyForElement = function (elementId, propertyType, value) {
        // if (value != undefined) {
        var _this = this;
        //Special cases
        //isRefBus... can only have one refBus so set all to false first if the new value is true
        if (propertyType === 'isRefBus' && value === 'true') {
            this.setPropertyForAllElements(propertyType, "false");
        }
        //Update the property for the element
        var elementToUpdate = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
        //Update if found
        if (elementToUpdate) {
            elementToUpdate.properties[propertyType] = value;
            console.log("Set property:" + propertyType + "for:" + elementId);
            //If child elements have the same property then it also gets updated
            //(i.e. fromBus and toBus for dirBranch)
            for (var _i = 0, _a = this.getChildElements(elementId).filter(function (childElement) { return _this.modelElementDefService.elementHasProperty(childElement, propertyType); }); _i < _a.length; _i++) {
                var childElementWithProperty = _a[_i];
                this.setPropertyForElement(childElementWithProperty.elementId, propertyType, value);
            }
        }
        // }
        // else {
        //   console.log("Set property: no value");
        // }
    };
    ModelElementDataService.prototype.setPropertyForAllElements = function (propertyType, value) {
        console.log("setPropertyForAllElements");
        if (value) {
            var elementsToUpdate = this.modelElements.filter(function (element) { return element.properties[propertyType]; });
            for (var _i = 0, elementsToUpdate_1 = elementsToUpdate; _i < elementsToUpdate_1.length; _i++) {
                var elementToUpdate = elementsToUpdate_1[_i];
                console.log("update property:" + propertyType + " of:" + elementToUpdate.elementType + " to:" + value);
                elementToUpdate.properties[propertyType] = value;
            }
        }
        else {
            console.log("NO VALUE");
        }
    };
    ModelElementDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementDataService);
    return ModelElementDataService;
}());
exports.ModelElementDataService = ModelElementDataService;
