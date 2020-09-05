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
    function ModelElementDataService() {
        this.modelElements = [];
        this.elementPropertyTypes = [];
        this.elementTypeProperties = {};
        this.elementNextIndex = new Map();
        //Property Types (and Defaults)
        this.elementPropertyTypes.push({ propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: true }, { propertyTypeId: 'connId1', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'connId2', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'maxFlow', primitiveType: 'number', defaultValue: '100' }, { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10' }, { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001' }, { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3' }, { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80' }, { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100' }, { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90' }, { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10' }, { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70' }, { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150' }, { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25' }, { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2' }, { propertyTypeId: 'maxGen', primitiveType: 'number', defaultValue: '100' });
        //Add static elements, accessed via the Settings display
        // var elementProperties: ElementProperties = {};
        // elementProperties['parentTypeId'] = 'load';
        // elementProperties['childTypeId'] = 'bidTranche'
        // elementProperties['childCount'] = '3'
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementTypeId: 'childSet',
            properties: this.makeDict([
                { 'parentTypeId': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }
            ])
        });
        this.modelElements.push({
            elementId: 'genTrancheDef', elementTypeId: 'childSet',
            properties: this.makeDict([
                { 'parentTypeId': 'gen' }, { 'childTypeId': 'genTranche' }, { 'childCount': '3' }
            ])
        });
        this.modelElements.push({
            elementId: 'resTrancheDef', elementTypeId: 'childSet',
            properties: this.makeDict([
                { 'parentTypeId': 'gen' }, { 'childTypeId': 'resTranche' }, { 'childCount': '3' }
            ])
        });
        this.modelElements.push({
            elementId: 'lossTrancheDef', elementTypeId: 'childSet',
            properties: this.makeDict([
                { 'parentTypeId': 'branch' }, { 'childTypeId': 'lossTranche' }, { 'childCount': '3' }
            ])
        });
        //Element Types and their Property Type Ids
        this.elementTypeProperties['bus'] = ['isRefBus'];
        this.elementTypeProperties['branch'] = ['connId1', 'connId2', 'maxFlow', 'susceptance'];
        this.elementTypeProperties['gen'] = ['connId1', 'maxGen'];
        this.elementTypeProperties['load'] = ['connId1'];
        this.elementTypeProperties['childSet'] = ['parentTypeId', 'childTypeId', 'childCount'];
        this.elementTypeProperties['bidTranche'] = ['parentId', 'bidLimit', 'bidPrice'];
        this.elementTypeProperties['genTranche'] = ['parentId', 'genLimit', 'genPrice'];
        this.elementTypeProperties['resTranche'] = ['parentId', 'resLimit', 'resPrice'];
        this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
    }
    ModelElementDataService.prototype.getIdForNewElementOfType = function (elementTypeId) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementTypeId] == undefined) {
            this.elementNextIndex[elementTypeId] = 1;
        }
        var elementIndex = this.elementNextIndex[elementTypeId];
        //Make the i.d.
        var newId = elementTypeId + ("000" + elementIndex).slice(-3);
        this.elementNextIndex[elementTypeId] = elementIndex + 1;
        console.log("New Id:" + newId);
        return newId;
    };
    ModelElementDataService.prototype.addElement = function (elementId, elementTypeId, properties) {
        this.modelElements.push({
            elementId: elementId,
            elementTypeId: elementTypeId,
            properties: properties
        });
    };
    ModelElementDataService.prototype.getPropertyTypeIdsFor = function (elementTypeId) {
        console.log("Get properties for: " + elementTypeId);
        var properties = this.elementTypeProperties[elementTypeId];
        console.log("Got properties: " + properties);
        return properties;
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
    ModelElementDataService.prototype.getDefaultPropertyForPropertTypeId = function (propertyTypeId) {
        var elementProperty = this.elementPropertyTypes.filter(function (elementPropertyType) { return elementPropertyType.propertyTypeId === propertyTypeId; })[0];
        return elementProperty.defaultValue;
    };
    ModelElementDataService.prototype.getModelElements = function () {
        return this.modelElements;
    };
    ModelElementDataService.prototype.getModelElementForId = function (elementId) {
        return this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
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
    ModelElementDataService.prototype.getValueForElementProperty = function (elementId, propertyTypeId) {
        var properties = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties;
        return properties[propertyTypeId];
    };
    ModelElementDataService.prototype.setValueForElementProperty = function (elementId, propertyTypeId, value) {
        this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties[propertyTypeId] = value;
    };
    ModelElementDataService.prototype.makeProperties = function (elementTypeId, propertiesToAdd, self) {
        console.log("Make Properties For:" + elementTypeId);
        var properties = {};
        propertiesToAdd.forEach(function (propertyTypeId) {
            console.log("looking for property " + propertyTypeId);
            properties[propertyTypeId] = self.getDefaultPropertyForPropertTypeId(propertyTypeId);
        });
        return properties;
    };
    ModelElementDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementDataService);
    return ModelElementDataService;
}());
exports.ModelElementDataService = ModelElementDataService;
