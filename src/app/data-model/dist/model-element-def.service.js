"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModelElementDefService = void 0;
var core_1 = require("@angular/core");
var ModelElementDefService = /** @class */ (function () {
    function ModelElementDefService() {
        this.elementPropertyTypes = [];
        //Property Types (and Defaults)
        this.elementPropertyTypes.push({ propertyTypeId: 'isRefBus', primitiveType: 'bool', defaultValue: 'false', visible: true }, { propertyTypeId: 'fromBus', primitiveType: 'string', defaultValue: 'none', visible: false }, { propertyTypeId: 'toBus', primitiveType: 'string', defaultValue: 'none', visible: false }, { propertyTypeId: 'flowMax', primitiveType: 'number', defaultValue: '100', visible: true }, { propertyTypeId: 'resistance', primitiveType: 'number', defaultValue: '10', visible: true }, { propertyTypeId: 'susceptance', primitiveType: 'number', defaultValue: '0.001', visible: true }, { propertyTypeId: 'childCount', primitiveType: 'number', defaultValue: '3', visible: false }, { propertyTypeId: 'parentTypeId', primitiveType: 'string', defaultValue: 'none', visible: false }, { propertyTypeId: 'childTypeId', primitiveType: 'string', defaultValue: 'none', visible: false }, { propertyTypeId: 'parentId', primitiveType: 'string', defaultValue: 'none', visible: false }, { propertyTypeId: 'genLimit', primitiveType: 'number', defaultValue: '80', visible: true }, { propertyTypeId: 'genPrice', primitiveType: 'number', defaultValue: '100', visible: true }, { propertyTypeId: 'resLimit', primitiveType: 'number', defaultValue: '90', visible: true }, { propertyTypeId: 'resPrice', primitiveType: 'number', defaultValue: '10', visible: true }, { propertyTypeId: 'bidLimit', primitiveType: 'number', defaultValue: '70', visible: true }, { propertyTypeId: 'bidPrice', primitiveType: 'number', defaultValue: '150', visible: true }, { propertyTypeId: 'flowLimit', primitiveType: 'number', defaultValue: '25', visible: true }, { propertyTypeId: 'lossLimit', primitiveType: 'number', defaultValue: '2', visible: true }, { propertyTypeId: 'capacityMax', primitiveType: 'number', defaultValue: '100', visible: true }
        // { propertyTypeId: 'posMult', primitiveType: 'number', defaultValue: '1', visible: true },
        // { propertyTypeId: 'negMult', primitiveType: 'number', defaultValue: '-1', visible: true }
        );
    }
    ModelElementDefService.prototype.propertyIsVisible = function (propertyTypeId) {
        console.log("get visible status for property:" + propertyTypeId);
        var propertyType = this.elementPropertyTypes.filter(function (property) { return property.propertyTypeId === propertyTypeId; })[0];
        return propertyType.visible;
    };
    ModelElementDefService.prototype.getDefaultPropertyForPropertTypeId = function (propertyTypeId) {
        var elementProperty = this.elementPropertyTypes.filter(function (elementPropertyType) { return elementPropertyType.propertyTypeId === propertyTypeId; })[0];
        if (elementProperty) {
            return elementProperty.defaultValue;
        }
        else {
            console.log("%c" + "No Default found for " + propertyTypeId, "color: red");
            return "";
        }
    };
    ModelElementDefService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementDefService);
    return ModelElementDefService;
}());
exports.ModelElementDefService = ModelElementDefService;
