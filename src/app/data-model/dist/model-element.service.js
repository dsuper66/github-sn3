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
        this.elementNextIndex = new Map();
        this.elementPropertyTypes = [];
        this.propertyTypeIdsOfElementType = {};
        // private propertiesOfElementType : Map<string, string[]>;
        this.valueTypesOfProperties = new Map();
        // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display
        this.allProperties = [];
        //Property Types and Defaults
        this.elementPropertyTypes.push({ propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: true }, { propertyTypeId: 'connId1', primitiveType: 'string', defaultValue: 'nil' }, { propertyTypeId: 'connId2', primitiveType: 'string', defaultValue: 'nil' }, { propertyTypeId: 'max', primitiveType: 'number', defaultValue: '100' }, { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10' }, { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001' }, { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'nil' }, { propertyTypeId: 'quantity', primitiveType: 'number', defaultValue: '70' }, { propertyTypeId: 'price', primitiveType: 'number', defaultValue: '150' }, { propertyTypeId: 'flow', primitiveType: 'number', defaultValue: '25' }, { propertyTypeId: 'loss', primitiveType: 'number', defaultValue: '2' }, { propertyTypeId: 'genCapacity', primitiveType: 'number', defaultValue: '100' });
        //Element Types and their Property Type Ids
        this.propertyTypeIdsOfElementType['bus'] = ['isRefBus'];
        this.propertyTypeIdsOfElementType['branch'] = ['connId1', 'connId2', 'max', 'resistance', 'susceptance'];
        this.propertyTypeIdsOfElementType['gen'] = ['connId1', 'genCapacity'];
        this.propertyTypeIdsOfElementType['load'] = ['connId1'];
        this.propertyTypeIdsOfElementType['bidTranch'] = ['load', 'quantity', 'price'];
        this.propertyTypeIdsOfElementType['genTranch'] = ['gen', 'quantity', 'price'];
        this.propertyTypeIdsOfElementType['resTranch'] = ['gen', 'quantity', 'price'];
        this.propertyTypeIdsOfElementType['lossTranch'] = ['branch', 'flow', 'loss'];
    }
    ModelElementService.prototype.getPropertyTypeIdsOfElementType = function (elementTypeId) {
        console.log("from: " + this.propertyTypeIdsOfElementType);
        // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
        // return elementType.propertyTypeIds;
        return this.propertyTypeIdsOfElementType[elementTypeId];
    };
    ModelElementService.prototype.getModelElements = function () {
        return this.modelElements;
    };
    ModelElementService.prototype.addModelElement = function (elementTypeId) {
        //Get next index for i.d.
        if (this.elementNextIndex[elementTypeId] == undefined) {
            this.elementNextIndex[elementTypeId] = 1;
        }
        var elementIndex = this.elementNextIndex[elementTypeId];
        //Make the i.d.
        var elementId = elementTypeId + ("000" + elementIndex).slice(-3);
        this.elementNextIndex[elementTypeId] = elementIndex + 1;
        //Add the element
        this.modelElements.push({
            elementId: elementId,
            elementTypeId: elementTypeId,
            properties: this.makePropertiesForElementType(elementTypeId)
            // bus1: "",
            // bus2: ""
        });
        //Add any child elements associated with this element type
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
        var thesePropertyTypeIds = this.propertyTypeIdsOfElementType[elementTypeId];
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
