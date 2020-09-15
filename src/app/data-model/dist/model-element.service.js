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
    function ModelElementService(modelElementDataService) {
        this.modelElementDataService = modelElementDataService;
    }
    //Add element (for child elements record their parent)
    ModelElementService.prototype.addModelElement = function (elementTypeIdToAdd, parentId, childNum) {
        //Add the new element
        console.log("Add:" + elementTypeIdToAdd);
        //ID for the new element (child element is from parent)
        var elementIdForNewElement = (parentId && childNum)
            ? this.modelElementDataService.makeIdFromStringAndNumber(parentId + elementTypeIdToAdd, childNum)
            : this.modelElementDataService.getIdForNewElementOfType(elementTypeIdToAdd);
        //Properties
        var propertyTypeIds = this.modelElementDataService.getPropertyTypeIdsFor(elementTypeIdToAdd);
        var properties = this.modelElementDataService.makeProperties(elementTypeIdToAdd, propertyTypeIds, this.modelElementDataService);
        //Add the element
        this.modelElementDataService.addElement(elementIdForNewElement, elementTypeIdToAdd, properties);
        //If this is a child then assign parent property
        if (parentId) {
            this.modelElementDataService.setPropertyForElement(elementIdForNewElement, 'parentId', parentId);
        }
        //Create any child elements (linked back to parent like a gen is to a bus)
        var self = this;
        var childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeIdToAdd);
        childElementDefs.forEach(function (childElementDef) {
            var childType = childElementDef.properties['childTypeId'];
            var childCount = childElementDef.properties['childCount'];
            console.log(">>>>>>>>" + childType + " count:" + childCount);
            //Add the child record(s)
            for (var childNum_1 = 1; childNum_1 <= childCount; childNum_1++) {
                self.addModelElement(childType, elementIdForNewElement, childNum_1);
            }
        });
        //Special case
        //bus... need one (and only one) with isRefBus = true
        if (elementTypeIdToAdd === 'bus') {
            //If no refBus then make this refBus = true
            if (this.modelElementDataService.getElementsWithPropertyValue('isRefBus', 'true').length == 0) {
                this.modelElementDataService.setPropertyForElement(elementIdForNewElement, 'isRefBus', 'true');
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
