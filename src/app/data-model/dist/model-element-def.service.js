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
        this.elementPropertyTypeSettings = [];
        this.elementTypeProperties = {};
        this.defaultValueSettings = [];
        //Property Types
        //All property types must have an entry here, for the data entry display
        this.elementPropertyTypeSettings.push({ propertyType: 'isRefBus', primitiveType: 'bool', visible: true }, { propertyType: 'fromBus', primitiveType: 'string', visible: false }, { propertyType: 'toBus', primitiveType: 'string', visible: false }, { propertyType: 'flowMax', primitiveType: 'number', visible: true }, { propertyType: 'resistance', primitiveType: 'number', visible: true }, { propertyType: 'susceptance', primitiveType: 'number', visible: true }, { propertyType: 'childCount', primitiveType: 'number', visible: false }, { propertyType: 'parentType', primitiveType: 'string', visible: false }, { propertyType: 'childTypeId', primitiveType: 'string', visible: false }, { propertyType: 'parentId', primitiveType: 'string', visible: false }, { propertyType: 'trancheLimit', primitiveType: 'number', visible: true }, { propertyType: 'tranchePrice', primitiveType: 'number', visible: true }, { propertyType: 'flowLimit', primitiveType: 'number', visible: true }, { propertyType: 'lossLimit', primitiveType: 'number', visible: true }, { propertyType: 'capacityMax', primitiveType: 'number', visible: true }, { propertyType: 'direction', primitiveType: 'number', visible: true }, { propertyType: 'islandId', primitiveType: 'string', visible: false }, { propertyType: 'resShortfallPrice', primitiveType: 'number', visible: true });
        //Separate so that different element types can have different defaults for the same properties
        this.defaultValueSettings.push({ propertyType: 'isRefBus', elementType: 'bus', defaultValue: false }, { propertyType: 'flowMax', elementType: 'branch', defaultValue: 300 }, { propertyType: 'resistance', elementType: 'branch', defaultValue: 10 }, { propertyType: 'susceptance', elementType: 'branch', defaultValue: 1 }, { propertyType: 'trancheLimit', elementType: 'bidTranche', defaultValue: 100 }, { propertyType: 'tranchePrice', elementType: 'bidTranche', defaultValue: 160 }, { propertyType: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 250 }, { propertyType: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 70 }, { propertyType: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 90 }, { propertyType: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 }, { propertyType: 'capacityMax', elementType: 'gen', defaultValue: 120 }, 
        // { propertyType: 'childCount', elementType: 'childDef', defaultValue: 100 },
        { propertyType: 'resShortfallPrice', elementType: 'island', defaultValue: 9 });
        //Define Element Types and Property Types
        //An Element Type that is included in the model must be defined here to know its properties
        //Parent elements
        this.elementTypeProperties['bus'] = ['isRefBus'];
        //Branch (flow limit and losses are at the directional level)
        this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'susceptance', 'resistance', 'flowMax'];
        this.elementTypeProperties['gen'] = ['toBus', 'capacityMax', 'islandId'];
        this.elementTypeProperties['load'] = ['fromBus'];
        //Element definitions (created in the data service constructor) that define a child to be created 
        //(because the creation is not dynamic, this definition is not actually used)
        this.elementTypeProperties['childDef'] = ['parentType', 'childTypeId', 'childCount'];
        //Child elements - tranches
        //Bid and offer need bus (inherited), so cleared quantities go to bus
        this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'fromBus'];
        this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'toBus'];
        //Reserve needs islandId (inherited), so cleared quantities go to island
        this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'islandId'];
        this.elementTypeProperties['lossTranche'] = ['parentId', 'flowLimit', 'lossLimit'];
        //Child elements - unrestricted variables
        //Directional branches (power flow is at the parent branch level)
        this.elementTypeProperties['dirBranch'] = ['parentId', 'fromBus', 'toBus', 'direction', 'susceptance'];
        //Static elements
        this.elementTypeProperties['mathModel'] = [];
        this.elementTypeProperties['island'] = ['resShortfallPrice'];
    }
    ModelElementDefService.prototype.elementHasProperty = function (element, propertyType) {
        var properties = this.elementTypeProperties[element.elementType];
        return (properties.filter(function (property) { return property == propertyType; })[0] != undefined);
    };
    ModelElementDefService.prototype.propertyIsVisible = function (propertyType) {
        console.log("get visible status for property:" + propertyType);
        var propertyTypeSettings = this.elementPropertyTypeSettings.filter(function (property) { return property.propertyType === propertyType; })[0];
        return propertyTypeSettings.visible;
    };
    ModelElementDefService.prototype.getDefaultValueForProperty = function (propertyType, elementType) {
        var defaultValueSetting = this.defaultValueSettings.filter(function (defaultValueSetting) { return defaultValueSetting.propertyType === propertyType
            && defaultValueSetting.elementType == elementType; })[0];
        if (defaultValueSetting) {
            console.log("found default:" + defaultValueSetting.defaultValue);
            return defaultValueSetting.defaultValue;
        }
        else {
            console.log("%c" + "No Default found for:" + elementType + " property:" + propertyType, "color: red");
            return "";
        }
    };
    ModelElementDefService.prototype.getDefaultSettingsForElementType = function (elementType) {
        return this.defaultValueSettings.filter(function (defaultValueSetting) { return defaultValueSetting.elementType == elementType; });
    };
    ModelElementDefService.prototype.getPropertyTypesFor = function (elementType) {
        console.log("Get properties for: " + elementType);
        var properties = this.elementTypeProperties[elementType];
        console.log("Got properties: " + properties);
        return properties;
    };
    ModelElementDefService.prototype.elementTypeHasPropertyType = function (elementType, propertyType) {
        var propertyTypes = this.elementTypeProperties[elementType];
        if (propertyTypes) {
            if (propertyTypes.find(function (pt) { return pt === propertyType; })) {
                return true;
            }
        }
        return false;
    };
    ModelElementDefService.prototype.getPropertyCount = function (elementType) {
        var propertyTypes = this.elementTypeProperties[elementType];
        if (propertyTypes != undefined) {
            return propertyTypes.length;
        }
        else {
            return 0;
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
