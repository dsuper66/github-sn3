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
    ModelElementService.prototype.addModelElement = function (elementTypeIdToAdd, parentId) {
        //Add the new element
        console.log("Add:" + elementTypeIdToAdd);
        var elementIdForNewElement = this.modelElementDataService.getIdForNewElementOfType(elementTypeIdToAdd);
        var propertyTypeIds = this.modelElementDataService.getPropertyTypeIdsFor(elementTypeIdToAdd);
        var properties = this.modelElementDataService.makeProperties(elementTypeIdToAdd, propertyTypeIds, this.modelElementDataService);
        this.modelElementDataService.addElement(elementIdForNewElement, elementTypeIdToAdd, properties);
        //If this is a child then a parent Id will have been provided
        if (parentId) {
            //Set the parent property
            this.modelElementDataService.setValueForElementProperty(elementIdForNewElement, 'parentId', parentId);
        }
        //Create any child elements (linked back like a gen is to a bus)
        var self = this;
        var childElementDefs = this.modelElementDataService.getChildElementDefs(elementTypeIdToAdd);
        childElementDefs.forEach(function (childElementDef) {
            var childTypeId = childElementDef.properties['childTypeId'];
            var childCount = childElementDef.properties['childCount'];
            console.log(">>>>>>>>" + childTypeId + " count:" + childCount);
            //Add the child record(s)
            for (var childNum = 1; childNum <= childCount; childNum++) {
                self.addModelElement(childTypeId, elementIdForNewElement);
            }
        });
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
