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
        //Read-only properties
        this.readOnlyProperties = ['fromBus', 'toBus', 'parentId', 'islandId', 'childType', 'parentType', 'segFlowLimit', 'lossFlowRatio', 'direction'];
        //Properties that are string not number
        this.stringProperties = ['fromBus', 'toBus', 'parentId', 'islandId', 'childType', 'parentType'];
        //Defaults (different element types can have different defaults for the same properties)
        this.defaultValueSettings.push(
        // { propertyType: 'isRefBus', elementType: 'bus', defaultValue: 'false' },
        { propertyType: 'flowMax', elementType: 'branch', defaultValue: 300 }, { propertyType: 'resistance', elementType: 'branch', defaultValue: 0.0001 }, { propertyType: 'susceptance', elementType: 'branch', defaultValue: 2 }, { propertyType: 'trancheLimit', elementType: 'bidTranche', defaultValue: 100 }, { propertyType: 'tranchePrice', elementType: 'bidTranche', defaultValue: 1000 }, { propertyType: 'trancheLimit', elementType: 'enOfferTranche', defaultValue: 250 }, { propertyType: 'tranchePrice', elementType: 'enOfferTranche', defaultValue: 70 }, { propertyType: 'trancheLimit', elementType: 'resOfferTranche', defaultValue: 100 }, { propertyType: 'tranchePrice', elementType: 'resOfferTranche', defaultValue: 40 }, { propertyType: 'capacityMax', elementType: 'gen', defaultValue: 120 }, { propertyType: 'islandResShortfallPrice', elementType: 'island', defaultValue: 900 }, { propertyType: 'genResShortfallPrice', elementType: 'gen', defaultValue: 1200 });
        //Define all Element Types and Property Types
        //An Element Type that is included in the model must be defined here to know its properties
        //Parent elements
        // this.elementTypeProperties['bus'] = ['isRefBus'];
        this.elementTypeProperties['bus'] = [];
        //Branch (flow limit and losses are at the directional level)
        this.elementTypeProperties['branch'] = ['fromBus', 'toBus', 'susceptance', 'resistance', 'flowMax'];
        this.elementTypeProperties['gen'] = ['toBus', 'capacityMax', 'islandId', 'genResShortfallPrice'];
        this.elementTypeProperties['load'] = ['fromBus'];
        //Element definitions (created in the data service constructor) that define a child to be created 
        //(because the creation is not dynamic, this definition is not actually used)
        this.elementTypeProperties['childDef'] = ['parentType', 'childType', 'childCount'];
        //Child elements - tranches
        //Bid and offer need bus (inherited), so cleared quantities go to bus
        this.elementTypeProperties['bidTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'fromBus'];
        this.elementTypeProperties['enOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'toBus'];
        //Reserve needs islandId (inherited), so cleared quantities go to island
        this.elementTypeProperties['resOfferTranche'] = ['parentId', 'trancheLimit', 'tranchePrice', 'islandId'];
        //Flow-Loss segments
        this.elementTypeProperties['flowLossSegment'] = ['parentId', 'segFlowLimit', 'lossFlowRatio'];
        //Child elements - unrestricted variables
        //Directional branches (power flow is at the parent branch level)
        this.elementTypeProperties['dirBranch'] = ['parentId', 'fromBus', 'toBus', 'direction', 'susceptance'];
        //Static elements
        this.elementTypeProperties['mathModel'] = [];
        this.elementTypeProperties['island'] = ['islandResShortfallPrice'];
    }
    //Read-only if defined as such, or if parent has the same property
    ModelElementDefService.prototype.propertyIsReadOnly = function (propertyType) {
        return this.readOnlyProperties.filter(function (r) { return r === propertyType; }).length != 0;
    };
    ModelElementDefService.prototype.propertyIsString = function (propertyType) {
        return this.stringProperties.filter(function (s) { return s === propertyType; }).length != 0;
    };
    ModelElementDefService.prototype.elementHasProperty = function (element, propertyType) {
        var properties = this.elementTypeProperties[element.elementType];
        return (properties.filter(function (property) { return property == propertyType; })[0] != undefined);
    };
    ModelElementDefService.prototype.getDefaultSettingsAll = function () {
        return this.defaultValueSettings;
    };
    ModelElementDefService.prototype.getDefaultSettingsForElementType = function (elementType) {
        return this.defaultValueSettings.filter(function (defaultValueSetting) { return defaultValueSetting.elementType == elementType; });
    };
    ModelElementDefService.prototype.setDefaultValue = function (elementType, propertType, value) {
        var defaultSetting = this.defaultValueSettings.find(function (defaultValueSetting) {
            return defaultValueSetting.elementType == elementType
                && defaultValueSetting.propertyType == propertType;
        });
        if (defaultSetting) {
            defaultSetting.defaultValue = value;
        }
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
