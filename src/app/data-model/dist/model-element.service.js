"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModelElementService = void 0;
var core_1 = require("@angular/core");
var ModelElementService = /** @class */ (function () {
    function ModelElementService() {
        this.modelElements = [];
        this.elementPropertyTypes = [];
        this.elementTypeProperties = {};
        // private valueTypesOfProperties = new Map<string, string>();
        // private allProperties:String[] = [];
        this.elementNextIndex = new Map();
        //Property Types (and Defaults)
        this.elementPropertyTypes.push({ propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: true }, { propertyTypeId: 'connId1', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'connId2', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'maxFlow', primitiveType: 'number', defaultValue: '100' }, { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10' }, { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001' }, { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3' }, { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none' }, { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80' }, { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100' }, { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90' }, { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10' }, { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70' }, { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150' }, { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25' }, { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2' }, { propertyTypeId: 'maxGen', primitiveType: 'number', defaultValue: '100' });
        //Add static elements, accessed via the Settings display
        this.modelElements.push({
            elementId: 'bidTrancheDef', elementTypeId: 'childSet',
            properties: [{ 'parentTypeId': 'load' }, { 'childTypeId': 'bidTranche' }, { 'childCount': '3' }]
        });
        //Element Types and their Property Type Ids
        this.elementTypeProperties['bus'] = ['isRefBus'];
        this.elementTypeProperties['branch'] = ['connId1', 'connId2', 'maxFlow', 'susceptance'];
        this.elementTypeProperties['gen'] = ['connId1', 'maxGen'];
        this.elementTypeProperties['load'] = ['connId1'];
        this.elementTypeProperties['childSet'] = ['parentTypeId', 'childTypeId', 'childCount'];
        this.elementTypeProperties['bidTranch'] = ['parentId', 'bidLimit', 'bidPrice'];
        this.elementTypeProperties['genTranch'] = ['parentId', 'genLimit', 'genPrice'];
        this.elementTypeProperties['resTranch'] = ['parentId', 'resLimit', 'resPrice'];
        this.elementTypeProperties['lossTranch'] = ['parentId', 'flowLimit', 'lossLimit'];
    }
    ModelElementService.prototype.getPropertyTypeIdsOfElementType = function (elementTypeId) {
        console.log("from: " + this.elementTypeProperties);
        // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
        // return elementType.propertyTypeIds;
        return this.elementTypeProperties[elementTypeId];
    };
    ModelElementService.prototype.getModelElements = function () {
        return this.modelElements;
    };
    ModelElementService.prototype.getModelElementForId = function (elementId) {
        return this.modelElements.filter(function (element) { return element.elementId === elementId; })[0];
    };
    ModelElementService.prototype.addModelElement = function (elementTypeIdForNewElement) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementTypeIdForNewElement] == undefined) {
            this.elementNextIndex[elementTypeIdForNewElement] = 1;
        }
        var elementIndex = this.elementNextIndex[elementTypeIdForNewElement];
        //Make the i.d.
        var elementId = elementTypeIdForNewElement + ("000" + elementIndex).slice(-3);
        this.elementNextIndex[elementTypeIdForNewElement] = elementIndex + 1;
        //Add the element
        this.modelElements.push({
            elementId: elementId,
            elementTypeId: elementTypeIdForNewElement,
            properties: this.makePropertiesForElementType(elementTypeIdForNewElement)
            // bus1: "",
            // bus2: ""
        });
        //Add any child elements associated with this element type
        var childSetElements = this.modelElements.filter(function (element) { return element.elementTypeId === 'childSet'; });
        for (var _i = 0, childSetElements_1 = childSetElements; _i < childSetElements_1.length; _i++) {
            var childSetElement = childSetElements_1[_i];
            for (var _a = 0, _b = childSetElement.properties; _a < _b.length; _a++) {
                var property = _b[_a];
            }
            // console.log("***found childset:" + childSetElement.elementId);
            // const childSetForNewElement = childSetElements.filter(
            (function (childSet) { return childSet.properties['parentTypeId'] === elementTypeIdForNewElement; });
            ;
            // if (childSetForNewElement) {
            //   console.log("***element type:"
            //     + elementTypeIdForNewElement + " has child type:" + childSetForNewElement.properties['childTypeId']);
            // }
        }
        return elementId;
    };
    ModelElementService.prototype.getValueForElementProperty = function (elementId, propertyTypeId) {
        var properties = this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties;
        return properties[propertyTypeId];
    };
    ModelElementService.prototype.setValueForElementProperty = function (elementId, propertyTypeId, value) {
        this.modelElements.filter(function (element) { return element.elementId === elementId; })[0].properties[propertyTypeId] = value;
    };
    ModelElementService.prototype.makePropertiesForElementType = function (elementTypeId) {
        // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
        //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;
        console.log("makePropertiesForElementType of " + elementTypeId);
        var thesePropertyTypeIds = this.elementTypeProperties[elementTypeId];
        console.log("got property types: " + thesePropertyTypeIds);
        // let properties = this.elementPropertyTypes.filter(
        //   elementPropertyType => thesePropertyTypeIds.find(elementPropertyType.propertyTypeId thesePropertyTypeIds)
        // )
        var properties = {};
        var _loop_1 = function (propertyTypeId) {
            console.log("looking for property " + propertyTypeId);
            var elementProperty = this_1.elementPropertyTypes.filter(function (elementPropertyType) { return elementPropertyType.propertyTypeId === propertyTypeId; })[0];
            //Assign default
            properties[elementProperty.propertyTypeId] = elementProperty.defaultValue;
        };
        var this_1 = this;
        for (var _i = 0, thesePropertyTypeIds_1 = thesePropertyTypeIds; _i < thesePropertyTypeIds_1.length; _i++) {
            var propertyTypeId = thesePropertyTypeIds_1[_i];
            _loop_1(propertyTypeId);
        }
        return properties;
    };
    ModelElementService = __decorate([
        core_1.Injectable({
            //the preferred way to create a singleton service
            providedIn: 'root'
        })
    ], ModelElementService);
    return ModelElementService;
}());
exports.ModelElementService = ModelElementService;
