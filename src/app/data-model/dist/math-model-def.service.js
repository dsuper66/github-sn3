"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemType = exports.MathModelDefService = void 0;
var core_1 = require("@angular/core");
var MathModelDefService = /** @class */ (function () {
    function MathModelDefService() {
        this.constraintDefs = [];
        this.constraintComps = [];
        //Enable/disable varFactors in constraints
        //VarFactors are identified by elementType.varType
        // private disabledFactors: string[] = [];
        // factorIsEnabled(factorId: string) {
        //   return this.disabledFactors.filter(f => f === factorId).length == 0;
        // }
        // setFactorStatus(factorId: string, isEnabled: boolean) {
        //   if (isEnabled) { //remove from the disabledFactors array
        //     this.disabledFactors = this.disabledFactors.filter(f => f != factorId)
        //   }
        //   else if (this.factorIsEnabled(factorId)) { //add to the disabledFactors array if not already
        //     this.disabledFactors.push(factorId)
        //   }
        // }
        //Enable/Disable item, e.g., varFactor in Constraint, or a Constraint 
        //Items not in the array are enabled
        this.disabledItems = [];
        this.constraintDefs.push(
        // { constraintType:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', varType:'enTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'bidTrancheLimit', elementType:'bidTranche', varType:'bidTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'powerFlow', elementType:'branch', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'dirBranchLimit', elementType:'branch', varType:'', inEquality:'le', rhsValue:0, rhsProperty:'flowMax', factorValue:1, factorProperty:'' },
        // { constraintType:'objective', elementType:'mathModel', varType:'objectiveVal', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'resOffertTrancheLimit', elementType:'resOfferTranche', varType:'resTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'genEnResCalc', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
        // { constraintType:'genCapacityMax', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'capacityMax', factorValue:1, factorProperty:'' },
        // { constraintType:'islandFindRisk', elementType:'gen', varType:'genEnRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        { constraintType: 'nodeBal', elementType: 'bus', varType: '', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'enOffertTrancheLimit', elementType: 'enOfferTranche', varType: 'enTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'bidTrancheLimit', elementType: 'bidTranche', varType: 'bidTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'branch', varType: '', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'dirBranchLimit', elementType: 'branch', varType: '', inEquality: 'le', rhsValue: 0, rhsProperty: 'flowMax', factorValue: 1, factorProperty: '' }, { constraintType: 'objective', elementType: 'mathModel', varType: 'objectiveVal', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'resOffertTrancheLimit', elementType: 'resOfferTranche', varType: 'resTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'genEnResCalc', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'genCapacityMax', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: 'capacityMax', factorValue: 1, factorProperty: '' }, { constraintType: 'islandFindRisk', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'islandResCalc', elementType: 'island', varType: 'islandRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', varType: 'islandRisk', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'brFlowIsSumOfSegs', elementType: 'dirBranch', varType: 'branchFlow', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'brLossIsSumOfSegs', elementType: 'dirBranch', varType: 'branchLoss', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'segLossForFlow', elementType: 'flowLossSegment', varType: 'segmentLoss', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' });
        this.constraintComps.push(
        // { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'direction' },
        // { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
        // { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' },
        // { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' },
        // { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' },
        // { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
        // { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' },
        // { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' },
        // { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'islandResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'islandResShortfallPrice' },
        // { constraintType: 'objective', elementType: 'gen', propertyMap: 'all', varType: 'genResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'genResShortfallPrice' },
        // { constraintType: 'genEnResCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'genEnResCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'islandFindRisk', elementType: 'gen', propertyMap: 'self', varType: 'genResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchLoss', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' }, { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'islandResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'islandResShortfallPrice' }, { constraintType: 'objective', elementType: 'gen', propertyMap: 'all', varType: 'genResShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'genResShortfallPrice' }, { constraintType: 'genEnResCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'genEnResCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'islandFindRisk', elementType: 'gen', propertyMap: 'self', varType: 'genResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandResShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'brFlowIsSumOfSegs', elementType: 'flowLossSegment', propertyMap: 'parentId', varType: 'segmentFlow', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'brLossIsSumOfSegs', elementType: 'flowLossSegment', propertyMap: 'parentId', varType: 'segmentLoss', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'segLossForFlow', elementType: 'flowLossSegment', propertyMap: 'self', varType: 'segmentFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'lossFlowRatio' });
        //Array for disabling constraints and varFactors
        this.disabledItems[ItemType.Constraint] = [];
        this.disabledItems[ItemType.VarFactor] = [];
        //Some model items are disabled by default
        //this.disabledItems[ItemType.Constraint].push("resCover");
        //this.disabledItems[ItemType.VarFactor].push("brLossIsSumOfSegs");
        this.setReservesEnabled(false);
        this.setLossesEnabled(false);
    }
    MathModelDefService.prototype.itemIsEnabled = function (itemType, componentId) {
        //If zero entries found in the disabled array then this component is enabled
        if (this.disabledItems[itemType]) {
            return this.disabledItems[itemType].filter(function (f) { return f === componentId; }).length == 0;
        }
        else {
            return true;
        }
    };
    MathModelDefService.prototype.setItemStatus = function (itemType, componentId, isEnabled) {
        //If isEnabled then remove from the disabled array
        if (isEnabled) {
            this.disabledItems[itemType] = this.disabledItems[itemType].filter(function (f) { return f != componentId; });
        }
        else if (this.itemIsEnabled(itemType, componentId)) { //add to the disabled array if not already
            this.disabledItems[itemType].push(componentId);
            console.log("disable itemType:" + itemType + " componentId:" + componentId);
        }
    };
    //Enabble/Disable specific functionality
    MathModelDefService.prototype.setReservesEnabled = function (status) {
        console.log("set reserves:" + status);
        this.setItemStatus(ItemType.Constraint, "resCover", status);
    };
    MathModelDefService.prototype.getReservesEnabled = function () {
        console.log("get reserves");
        return this.itemIsEnabled(ItemType.Constraint, "resCover");
    };
    MathModelDefService.prototype.setLossesEnabled = function (status) {
        console.log("set losses:" + status);
        this.setItemStatus(ItemType.Constraint, "segLossForFlow", status);
        this.setItemStatus(ItemType.VarFactor, "dirBranch.branchLoss", status);
    };
    MathModelDefService.prototype.getLossesEnabled = function () {
        console.log("get losses");
        if (!this.itemIsEnabled(ItemType.Constraint, "segLossForFlow")
            && !this.itemIsEnabled(ItemType.VarFactor, "dirBranch.branchLoss")) {
            return false;
        }
        else {
            return true;
        }
    };
    //get constraints where the constraintType is not disabled
    MathModelDefService.prototype.getActiveConstraintDefs = function () {
        var _this = this;
        return this.constraintDefs.filter(function (cd) { return !_this.disabledItems[ItemType.Constraint].find(function (di) { return di === cd.constraintType; }); });
    };
    //get constraint components that are not disabled and the constraintType is not disabled
    //VarFactors are identified by elementType.varType
    MathModelDefService.prototype.getActiveConstraintComps = function () {
        var _this = this;
        return this.constraintComps.filter(function (cc) {
            return !_this.disabledItems[ItemType.VarFactor].find(function (di) { return di === cc.elementType + "." + cc.varType; })
                && !_this.disabledItems[ItemType.Constraint].find(function (di) { return di === cc.constraintType; });
        });
    };
    MathModelDefService.prototype.getConstraintDefsAll = function () {
        return this.constraintDefs;
    };
    MathModelDefService.prototype.getConstraintCompsAll = function () {
        return this.constraintComps;
    };
    MathModelDefService.prototype.getConstraintDef = function (constraintType) {
        console.log("get constraint def of type:" + constraintType);
        return this.constraintDefs.filter(function (cc) { return cc.constraintType === constraintType; })[0];
    };
    MathModelDefService.prototype.getConstraintComps = function (constraintType) {
        console.log("get constraint comps of type:" + constraintType);
        return this.constraintComps.filter(function (cc) { return cc.constraintType === constraintType; });
    };
    MathModelDefService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MathModelDefService);
    return MathModelDefService;
}());
exports.MathModelDefService = MathModelDefService;
//Enable/disable component
var ItemType;
(function (ItemType) {
    ItemType[ItemType["VarFactor"] = 0] = "VarFactor";
    ItemType[ItemType["Constraint"] = 1] = "Constraint";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
