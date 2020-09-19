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
        // //Property Types (and Defaults)
        // this.elementPropertyTypes.push(
        //   { propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: 'false', visible: true },
        //   { propertyTypeId: 'fromBus', primitiveType: 'string', defaultValue: 'none', visible: false },
        //   { propertyTypeId: 'toBus', primitiveType: 'string', defaultValue: 'none', visible: false },
        //   { propertyTypeId: 'flowMax', primitiveType: 'number', defaultValue: '100', visible: true },
        //   { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10', visible: true },
        //   { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001', visible: true },
        //   { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3', visible: false },
        //   { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
        //   { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none', visible: false },
        //   { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none', visible: false },
        //   { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80', visible: true },
        //   { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100', visible: true },
        //   { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90', visible: true },
        //   { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10', visible: true },
        //   { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70', visible: true },
        //   { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150', visible: true },
        //   { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25', visible: true },
        //   { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2', visible: true },
        //   { propertyTypeId: 'capacityMax', primitiveType: 'number', defaultValue: '100', visible: true }
        //   // { propertyTypeId: 'posMult', primitiveType: 'number', defaultValue: '1', visible: true },
        //   // { propertyTypeId: 'negMult', primitiveType: 'number', defaultValue: '-1', visible: true }
        // )
        this.modelElementDefService = modelElementDefService;
        // private elementPropertyTypes: ElementPropertyType[] = [];
        this.elementTypeProperties = {};
        this.elementTypeVarTypes = {};
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
        //Element Types and Property Types
        //Parent elements
        this.elementTypeProperties['bus'] = ['isRefBus'];
        this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'flowMax', 'susceptance'];
        this.elementTypeProperties['gen'] = ['toBus', 'capacityMax'];
        this.elementTypeProperties['load'] = ['fromBus'];
        //Element that defines a child
        this.elementTypeProperties['childDef'] = ['parentTypeId', 'childTypeId', 'childCount'];
        //Child elements - tranches
        this.elementTypeProperties['bidTranche'] = ['parentId', 'bidLimit', 'bidPrice'];
        this.elementTypeProperties['genTranche'] = ['parentId', 'genLimit', 'genPrice'];
        this.elementTypeProperties['resTranche'] = ['parentId', 'resLimit', 'resPrice'];
        this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
        //Child elements - unrestricted variables
        this.elementTypeProperties['posFlow'] = ['parentId'];
        this.elementTypeProperties['negFlow'] = ['parentId'];
        this.elementTypeProperties['posAngle'] = ['parentId'];
        this.elementTypeProperties['negAngle'] = ['parentId'];
        //Element Types and Variables
        this.elementTypeVarTypes['bus'] = ['phaseAngle'];
        this.elementTypeVarTypes['posAngle'] = ['phaseAngle'];
        this.elementTypeVarTypes['negAngle'] = ['phaseAngle'];
        this.elementTypeVarTypes['branch'] = ['branchFlow'];
        this.elementTypeVarTypes['posFlow'] = ['branchFlow'];
        this.elementTypeVarTypes['negFlow'] = ['branchFlow'];
        this.elementTypeVarTypes['gen'] = ['genCleared'];
        this.elementTypeVarTypes['load'] = ['loadCleared'];
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
    ModelElementDataService.prototype.getPropertyTypeIdsFor = function (elementTypeId) {
        console.log("Get properties for: " + elementTypeId);
        var properties = this.elementTypeProperties[elementTypeId];
        console.log("Got properties: " + properties);
        return properties;
    };
    // getDefaultPropertyForPropertTypeId(propertyTypeId: string): any {
    //   const elementProperty = this.elementPropertyTypes.filter(
    //     elementPropertyType => elementPropertyType.propertyTypeId === propertyTypeId)[0];
    //   if (elementProperty) {
    //     return elementProperty.defaultValue;
    //   }
    //   else {
    //     console.log("%c" + "No Default found for " + propertyTypeId, "color: red");
    //     return "";
    //   }
    // }
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
    ModelElementDataService.prototype.makeProperties = function (elementTypeId, propertiesToAdd, self) {
        console.log("Make Properties For:" + elementTypeId);
        var properties = {};
        propertiesToAdd.forEach(function (propertyTypeId) {
            console.log("looking for property " + propertyTypeId);
            properties[propertyTypeId] = self.modelElementDefService.getDefaultPropertyForPropertTypeId(propertyTypeId);
        });
        return properties;
    };
    // propertyIsVisible(propertyTypeId: string) {
    //   console.log("get visible status for property:" + propertyTypeId);
    //   const propertyType = this.elementPropertyTypes.filter(property => property.propertyTypeId === propertyTypeId)[0];
    //   return propertyType.visible;
    // }  
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
            var propertyTypeIds = this.getPropertyTypeIdsFor(element.elementTypeId);
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
