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
  function ModelElementService(modelElementDataService, modelElementDefService) {
    this.modelElementDataService = modelElementDataService;
    this.modelElementDefService = modelElementDefService;
  }

  ModelElementService.prototype.iff = function (condition, resultTrue, resultFalse) {
    if (condition) {
      return resultTrue;
    } else {
      return resultFalse;
    }
  }; //Add element (for child elements record their parent)


  ModelElementService.prototype.addModelElement = function (elementTypeToAdd, parentId, childNum) {
    //Add the new element
    console.log(">>>>>addModelElement:" + elementTypeToAdd); //ID for the new element 
    // const newId
    //   = (parentId && childNum) //child id incorporated parent id
    //     ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum)
    //     : this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);

    var newId;

    if (parentId && childNum) {
      //child element
      //Special Case
      //dirBranch child id has a suffix name not number
      if (elementTypeToAdd == 'dirBranch') {
        newId = parentId + elementTypeToAdd + (childNum == 1 ? "Pos" : "Neg"); // if (childNum == 1) {
        //   newId = parentId + elementTypeToAdd + "Pos"
        // }
        // else {
        //   newId = parentId + elementTypeToAdd + "Neg"
        // }
      } else {
        //child id is parent + child
        newId = this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum);
      }
    } else {
      //parent element
      newId = this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
    } //Add the element


    this.modelElementDataService.addElement(newId, elementTypeToAdd, {} //properties... empty and then populated either by defaults or data input
    ); //If this is a child then assign parent property

    if (parentId) {
      this.modelElementDataService.setPropertyForElement(newId, 'parentId', parentId);
    } //Special case
    //bus... need one (and only one) with isRefBus = true


    if (elementTypeToAdd === 'bus') {
      //If no refBus then make this refBus = true
      if (this.modelElementDataService.getElementsWherePropertyValue('isRefBus', 'true').length == 0) {
        this.modelElementDataService.setPropertyForElement(newId, 'isRefBus', 'true');
      }
    } //Special Case
    //dirBranch needs a direction property (which is a multiplier)


    if (elementTypeToAdd === 'dirBranch' && childNum != undefined) {
      this.modelElementDataService.setPropertyForElement(newId, 'direction', childNum == 1 ? 1 : -1);
    } //Create any child elements (linked back to parent like a gen is to a bus)


    var self = this;
    var childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeToAdd);
    childElementDefs.forEach(function (childElementDef) {
      var childType = childElementDef.properties['childType'];
      var childCount = childElementDef.properties['childCount'];
      console.log("Add Child Elements >>>>>>>>" + childType + " count:" + childCount); //Add the child record(s)

      for (var childNum_1 = 1; childNum_1 <= childCount; childNum_1++) {
        self.addModelElement(childType, newId, childNum_1);
      }
    }); //Set default values

    for (var _i = 0, _a = this.modelElementDefService.getDefaultSettingsForElementType(elementTypeToAdd); _i < _a.length; _i++) {
      var defaultValueSetting = _a[_i];
      var addDefaults = true; //If child element, only add defaults to number 1, i.e., don't repeat for all

      if (childNum) {
        if (childNum != 1) {
          addDefaults = false;
        }
      } //Add defaults


      if (addDefaults) {
        this.modelElementDataService.setPropertyForElement(newId, defaultValueSetting.propertyType, defaultValueSetting.defaultValue);
      }
    } //Special case
    //gen (and maybe others)... need an island 
    //(when we created the shape we made sure that we had an island, for now there is only one)


    var islandIdProperty = 'islandId';

    if (this.modelElementDefService.elementTypeHasPropertyType(elementTypeToAdd, islandIdProperty)) {
      var island = this.modelElementDataService.getModelElementOfType('island')[0];

      if (island) {
        console.log("###Island id:" + island.elementId);
        this.modelElementDataService.setPropertyForElement(newId, islandIdProperty, island.elementId);
      }
    }

    return newId;
  };

  ModelElementService = __decorate([core_1.Injectable({
    //the preferred way to create a singleton service
    providedIn: 'root'
  })], ModelElementService);
  return ModelElementService;
}();

exports.ModelElementService = ModelElementService;