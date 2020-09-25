"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.ModelElementService = void 0;

var core_1 = require("@angular/core");

var ModelElementService =
/** @class */
function () {
  function ModelElementService() {
    this.modelElements = [];
    this.elementNextIndex = new Map();
    this.elementPropertyTypes = [];
    this.propertyTypeIdsOfElementType = {}; // private propertiesOfElementType : Map<string, string[]>;

    this.valueTypesOfProperties = new Map(); // private propertiesDisplayOrder = new Map<string,bigint >(); //-ve => read only, 0 no display

    this.allProperties = [];
    this.elementPropertyTypes.push({
      propertyType: 'isRefBus',
      primitiveType: 'bool',
      defaultValue: true
    }, {
      propertyType: 'connId1',
      primitiveType: 'string',
      defaultValue: 'none'
    }, {
      propertyType: 'connId2',
      primitiveType: 'string',
      defaultValue: 'none'
    }, {
      propertyType: 'resistance',
      primitiveType: 'number',
      defaultValue: '10'
    }, {
      propertyType: 'susceptance',
      primitiveType: 'number',
      defaultValue: '0.001'
    }, {
      propertyType: 'enBids',
      primitiveType: 'tranches',
      defaultValue: [100, 70]
    }, {
      propertyType: 'enOffers',
      primitiveType: 'tranches',
      defaultValue: [50, 150]
    }, {
      propertyType: 'resOffers',
      primitiveType: 'tranches',
      defaultValue: [50, 150]
    }, {
      propertyType: 'genCapacity',
      primitiveType: 'number',
      defaultValue: '100'
    }); //Element Types and their Property Types

    this.propertyTypeIdsOfElementType['bus'] = ['isRefBus'];
    this.propertyTypeIdsOfElementType['branch'] = ['connId1', 'connId2', 'resistance', 'susceptance'];
    this.propertyTypeIdsOfElementType['gen'] = ['connId1', 'genCapacity'];
    this.propertyTypeIdsOfElementType['load'] = ['connId1', 'reqdLoad'];
    this.propertyTypeIdsOfElementType['genTranch'] = ['parentId', 'quantity', 'price'];
    this.propertyTypeIdsOfElementType['resTranch'] = ['parentId', 'quantity', 'price'];
    this.propertyTypeIdsOfElementType['lossTranch'] = ['parentId', 'flow', 'loss'];
  }

  ModelElementService.prototype.getPropertyTypeIdsOfElementType = function (elementTypeId) {
    console.log("from: " + this.propertyTypeIdsOfElementType); // let elementType = this.propertiesOfElementType.filter(elementType => elementType.elementTypeId === elementTypeId)[0];
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

    var elementIndex = this.elementNextIndex[elementTypeId]; //Make the i.d.

    var elementId = elementTypeId + ("000" + elementIndex).slice(-3);
    this.elementNextIndex[elementTypeId] = elementIndex + 1; //Add the element

    this.modelElements.push({
      elementId: elementId,
      elementTypeId: elementTypeId,
      properties: this.makePropertiesForElementType(elementTypeId) // bus1: "",
      // bus2: ""

    });
    return elementId;
  };

  ModelElementService.prototype.getValueForElementProperty = function (elementId, propertyType) {
    var properties = this.modelElements.filter(function (element) {
      return element.elementId === elementId;
    })[0].properties;
    return properties[propertyType];
  };

  ModelElementService.prototype.setValueForElementProperty = function (elementId, propertyType, value) {
    this.modelElements.filter(function (element) {
      return element.elementId === elementId;
    })[0].properties[propertyType] = value;
  };

  ModelElementService.prototype.makePropertiesForElementType = function (elementTypeId) {
    // let thesePropertyTypeIds = this.propertiesOfElementType.filter(
    //   elementType => elementType.elementTypeId === elementTypeId)[0].propertyTypeIds;
    console.log("makePropertiesForElementType of " + elementTypeId);
    var thesePropertyTypeIds = this.propertyTypeIdsOfElementType[elementTypeId];
    console.log("got property types: " + thesePropertyTypeIds); // let properties = this.elementPropertyTypes.filter(
    //   elementPropertyType => thesePropertyTypeIds.find(elementPropertyType.propertyType thesePropertyTypeIds)
    // )

    var properties = {};

    var _loop_1 = function _loop_1(propertyType) {
      console.log("looking for " + propertyType);
      var elementProperty = this_1.elementPropertyTypes.filter(function (elementPropertyType) {
        return elementPropertyType.propertyType === propertyType;
      })[0];
      properties[elementProperty.propertyType] = elementProperty.defaultValue;
    };

    var this_1 = this;

    for (var _i = 0, thesePropertyTypeIds_1 = thesePropertyTypeIds; _i < thesePropertyTypeIds_1.length; _i++) {
      var propertyType = thesePropertyTypeIds_1[_i];

      _loop_1(propertyType);
    }

    return properties;
  };

  ModelElementService = __decorate([core_1.Injectable({
    //the preferred way to create a singleton service
    providedIn: 'root'
  })], ModelElementService);
  return ModelElementService;
}();

exports.ModelElementService = ModelElementService;