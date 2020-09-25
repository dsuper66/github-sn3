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
        this.elementTypeProperties = {};
        this.defaultValueSettings = [];
        //Property Types
        this.elementPropertyTypes.push({ propertyTypeId: 'isRefBus', primitiveType: 'bool', visible: true }, { propertyTypeId: 'fromBus', primitiveType: 'string', visible: false }, { propertyTypeId: 'toBus', primitiveType: 'string', visible: false }, { propertyTypeId: 'flowMax', primitiveType: 'number', visible: true }, { propertyTypeId: 'resistance', primitiveType: 'number', visible: true }, { propertyTypeId: 'susceptance', primitiveType: 'number', visible: true }, { propertyTypeId: 'childCount', primitiveType: 'number', visible: false }, { propertyTypeId: 'parentTypeId', primitiveType: 'string', visible: false }, { propertyTypeId: 'childTypeId', primitiveType: 'string', visible: false }, { propertyTypeId: 'parentId', primitiveType: 'string', visible: false }, { propertyTypeId: 'trancheLimit', primitiveType: 'number', visible: true }, { propertyTypeId: 'tranchePrice', primitiveType: 'number', visible: true }, { propertyTypeId: 'flowLimit', primitiveType: 'number', visible: true }, { propertyTypeId: 'lossLimit', primitiveType: 'number', visible: true }, { propertyTypeId: 'capacityMax', primitiveType: 'number', visible: true }, { propertyTypeId: 'direction', primitiveType: 'number', visible: true });
        this.defaultValueSettings.push({ propertyTypeId: 'isRefBus', elementType: 'bus', defaultValue: false }, { propertyTypeId: 'flowMax', elementType: 'branch', defaultValue: 100 }, { propertyTypeId: 'resistance', elementType: 'branch', defaultValue: 10 }, { propertyTypeId: 'susceptance', elementType: 'branch', defaultValue: .001 }, { propertyTypeId: 'trancheLimit', elementType: 'bidTranche', defaultValue: 70 }, { propertyTypeId: 'tranchePrice', elementType: 'bidTranche', defaultValue: 150 }, { propertyTypeId: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 80 }, { propertyTypeId: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 100 }, { propertyTypeId: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 90 }, { propertyTypeId: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 }, { propertyTypeId: 'capacityMax', elementType: 'gen', defaultValue: 120 }, { propertyTypeId: 'childCount', elementType: 'childDef', defaultValue: 100 });
        //Element Types and Property Types
        //Parent elements
        this.elementTypeProperties['bus'] = ['isRefBus'];
        //Branch (flow limit and losses are at the directional level)
        this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'susceptance', 'resistance', 'flowMax'];
        this.elementTypeProperties['gen'] = ['toBus', 'capacityMax'];
        this.elementTypeProperties['load'] = ['fromBus'];
        //Element definitions (created in the data service) that define a child to be created 
        this.elementTypeProperties['childDef'] = ['parentTypeId', 'childTypeId', 'childCount'];
        //Child elements - tranches
        this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
        this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
        this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice'];
        this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
        //Child elements - unrestricted variables
        //Directional branches (power flow is at the parent branch level)
        this.elementTypeProperties['dirBranch'] = ['parentId', 'fromBus', 'toBus', 'direction'];
        // this.elementTypeProperties['dirBranchNeg'] = ['parentId', 'fromBus', 'toBus'];
    }
    ModelElementDefService.prototype.propertyIsVisible = function (propertyTypeId) {
        console.log("get visible status for property:" + propertyTypeId);
        var propertyType = this.elementPropertyTypes.filter(function (property) { return property.propertyTypeId === propertyTypeId; })[0];
        return propertyType.visible;
    };
    ModelElementDefService.prototype.getDefaultValueForProperty = function (propertyTypeId, elementType) {
        var defaultValueSetting = this.defaultValueSettings.filter(function (defaultValueSetting) { return defaultValueSetting.propertyTypeId === propertyTypeId
            && defaultValueSetting.elementType == elementType; })[0];
        if (defaultValueSetting) {
            console.log("found default:" + defaultValueSetting.defaultValue);
            return defaultValueSetting.defaultValue;
        }
        else {
            console.log("%c" + "No Default found for:" + elementType + " property:" + propertyTypeId, "color: red");
            return "";
        }
    };
    ModelElementDefService.prototype.getPropertyTypeIdsFor = function (elementType) {
        console.log("Get properties for: " + elementType);
        var properties = this.elementTypeProperties[elementType];
        console.log("Got properties: " + properties);
        return properties;
    };
    ModelElementDefService.prototype.makeProperties = function (elementType, propertiesToAdd, childNum) {
        console.log("Make Properties For:" + elementType + " from propertiesToAdd count:" + propertiesToAdd.length);
        var properties = {};
        //Get defaults
        for (var _i = 0, propertiesToAdd_1 = propertiesToAdd; _i < propertiesToAdd_1.length; _i++) {
            var propertyTypeId = propertiesToAdd_1[_i];
            console.log("looking for defaults for property: " + propertyTypeId);
            var addDefaults = true;
            //If child element, only add defaults to number 1
            if (childNum) {
                if (childNum != 1) {
                    addDefaults = false;
                }
            }
            //Add defaults
            if (addDefaults) {
                properties[propertyTypeId] = this.getDefaultValueForProperty(propertyTypeId, elementType);
            }
        }
        return properties;
    };
    ModelElementDefService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ModelElementDefService);
    return ModelElementDefService;
}());
exports.ModelElementDefService = ModelElementDefService;
