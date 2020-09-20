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
        //Add child element defs... elements created automatically with parent
        //parentTypeId is used to identify the parent
        //Bid Tranches
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementTypeId: 'trancheDef',
            properties: this.makeDict([
                { 'parentTypeId': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }
            ]),
            visible: false
        });
        //Gen Tranches
        this.modelElements.push({
            elementId: 'genTrancheDef', elementTypeId: 'trancheDef',
            properties: this.makeDict([
                { 'parentTypeId': 'gen' }, { 'childTypeId': 'genTranche' }, { 'childCount': '3' }
            ]),
            visible: false
        });
        //Res Tranches
        this.modelElements.push({
            elementId: 'resTrancheDef', elementTypeId: 'trancheDef',
            properties: this.makeDict([
                { 'parentTypeId': 'gen' }, { 'childTypeId': 'resTranche' }, { 'childCount': '3' }
            ]),
            visible: false
        });
        //Loss Tranches
        this.modelElements.push({
            elementId: 'lossTrancheDef', elementTypeId: 'trancheDef',
            properties: this.makeDict([
                { 'parentTypeId': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }
            ]),
            visible: false
        });
        //Unrestricted - branch flow
        this.modelElements.push({
            elementId: 'branchFlowPos', elementTypeId: 'unrestrictedDef',
            properties: this.makeDict([
                { 'parentTypeId': 'branch' },
                { 'childTypeId': 'posFlow' }, { 'childCount': '1' }
            ]),
            visible: false
        });
        this.modelElements.push({
            elementId: 'branchFlowNeg', elementTypeId: 'unrestrictedDef',
            properties: this.makeDict([
                { 'parentTypeId': 'branch' },
                { 'childTypeId': 'negFlow' }, { 'childCount': '1' }
            ]),
            visible: false
        });
        //Unrestricted - bus angle
        this.modelElements.push({
            elementId: 'phaseAnglePos', elementTypeId: 'unrestrictedDef',
            properties: this.makeDict([
                { 'parentTypeId': 'bus' },
                { 'childTypeId': 'posAngle' }, { 'childCount': '1' }
            ]),
            visible: false
        });
        this.modelElements.push({
            elementId: 'phaseAngleNeg', elementTypeId: 'unrestrictedDef',
            properties: this.makeDict([
                { 'parentTypeId': 'bus' },
                { 'childTypeId': 'negAngle' }, { 'childCount': '1' }
            ]),
            visible: false
        });
    }
    ModelElementDataService.prototype.getIdForNewElementOfType = function (elementTypeId) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementTypeId] == undefined) {
            this.elementNextIndex[elementTypeId] = 1;
        }
        var elementIndex = this.elementNextIndex[elementTypeId];
        //Make the i.d.
        var newId = this.makeIdFromStringAndNumber(elementTypeId, elementIndex);
        this.elementNextIndex[elementTypeId] = elementIndex + 1;
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
                console.log(key + '>>>>' + value);
                dict[key] = value;
            });
        });
        return dict;
    };
    //===DATA===
    ModelElementDataService.prototype.addElement = function (elementId, elementTypeId, properties) {
        this.modelElements.push({
            elementId: elementId,
            elementTypeId: elementTypeId,
            properties: properties,
            visible: true
        });
    };
    //Child elements
    ModelElementDataService.prototype.getChildElementDefs = function (elementTypeId) {
        return this.modelElements.filter(function (element) { return element.properties['parentTypeId'] === elementTypeId; });
    };
    ModelElementDataService.prototype.getChildIdsForElementId = function (elementId) {
        return this.modelElements.filter(function (element) { return element.properties['parentId'] === elementId; });
    };
    //Test - get all properties of all
    ModelElementDataService.prototype.listAllElements = function (elementId) {
        for (var _i = 0, _a = this.modelElements; _i < _a.length; _i++) {
            var element = _a[_i];
            var propertyTypeIds = this.modelElementDefService.getPropertyTypeIdsFor(element.elementTypeId);
            for (var _b = 0, propertyTypeIds_1 = propertyTypeIds; _b < propertyTypeIds_1.length; _b++) {
                var propertyTypeId = propertyTypeIds_1[_b];
                console.log("##>>" + element.elementId + " : " + propertyTypeId + " : " + element.properties[propertyTypeId]);
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
    ModelElementDataService.prototype.getValueForElementProperty = function (elementId, propertyTypeId) {
        var properties = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties;
        return properties[propertyTypeId];
    };
    ModelElementDataService.prototype.getElementsWithPropertyValue = function (propertyTypeId, value) {
        return this.modelElements.filter(function (element) { return element.properties[propertyTypeId] === value; });
    };
    ModelElementDataService.prototype.setPropertyForElement = function (elementId, propertyTypeId, value) {
        console.log("setPropertyForElement");
        if (value) {
            //Special cases
            //isRefBus... can only have one refBus so set all to false first if the new value is true
            if (propertyTypeId === 'isRefBus' && value === 'true') {
                this.setPropertyForAllElements(propertyTypeId, "false");
            }
            //Update the property for the element
            var elementToUpdate = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
            elementToUpdate.properties[propertyTypeId] = value;
        }
        else {
            console.log("NO VALUE");
        }
    };
    ModelElementDataService.prototype.setPropertyForAllElements = function (propertyTypeId, value) {
        console.log("setPropertyForAllElements");
        if (value) {
            var elementsToUpdate = this.modelElements.filter(function (element) { return element.properties[propertyTypeId]; });
            for (var _i = 0, elementsToUpdate_1 = elementsToUpdate; _i < elementsToUpdate_1.length; _i++) {
                var elementToUpdate = elementsToUpdate_1[_i];
                console.log("update property:" + propertyTypeId + " of:" + elementToUpdate.elementTypeId + " to:" + value);
                elementToUpdate.properties[propertyTypeId] = value;
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
