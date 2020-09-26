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
    function ModelElementService(modelElementDataService, modelElementDefService) {
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
    }
    //Add element (for child elements record their parent)
    ModelElementService.prototype.addModelElement = function (elementTypeToAdd, parentId, childNum) {
        //Add the new element
        console.log("addModelElement:" + elementTypeToAdd);
        //ID for the new element (child element is from parent)
        var elementIdForNewElement = (parentId && childNum)
            ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeToAdd, childNum)
            : this.modelElementDataService.getIdForNewElementOfType(elementTypeToAdd);
        //Properties
        var propertyTypeIds = this.modelElementDefService.getPropertyTypesFor(elementTypeToAdd);
        var properties = this.modelElementDefService.makeProperties(elementTypeToAdd, propertyTypeIds, childNum);
        //Add the element
        this.modelElementDataService.addElement(elementIdForNewElement, elementTypeToAdd, properties);
        //If this is a child then assign parent property
        if (parentId) {
            this.modelElementDataService.setPropertyForElement(elementIdForNewElement, 'parentId', parentId);
        }
        //Special case
        //dirBranch needs a direction property
        if (elementTypeToAdd === 'dirBranch' && childNum != undefined) {
            this.modelElementDataService.setPropertyForElement(elementIdForNewElement, 'direction', childNum == 1 ? 1 : -1);
        }
        //Create any child elements (linked back to parent like a gen is to a bus)
        var self = this;
        var childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeToAdd);
        childElementDefs.forEach(function (childElementDef) {
            var childType = childElementDef.properties['childTypeId'];
            var childCount = childElementDef.properties['childCount'];
            console.log("Add Child Elements >>>>>>>>" + childType + " count:" + childCount);
            //Add the child record(s)
            for (var childNum_1 = 1; childNum_1 <= childCount; childNum_1++) {
                self.addModelElement(childType, elementIdForNewElement, childNum_1);
            }
        });
        //Special case
        //bus... need one (and only one) with isRefBus = true
        if (elementTypeToAdd === 'bus') {
            //If no refBus then make this refBus = true
            if (this.modelElementDataService.getElementsWithPropertyValue('isRefBus', 'true').length == 0) {
                this.modelElementDataService.setPropertyForElement(elementIdForNewElement, 'isRefBus', 'true');
            }
        }
        //Set default values
        for (var _i = 0, _a = this.modelElementDefService.getDefaultSettingsForElementType(elementTypeToAdd); _i < _a.length; _i++) {
            var defaultValueSetting = _a[_i];
            var addDefaults = true;
            //If child element, only add defaults to number 1
            if (childNum) {
                if (childNum != 1) {
                    addDefaults = false;
                }
            }
            //Add defaults
            if (addDefaults) {
                this.modelElementDataService.setPropertyForElement(elementIdForNewElement, defaultValueSetting.propertyType, defaultValueSetting.defaultValue);
            }
        }
        return elementIdForNewElement;
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
