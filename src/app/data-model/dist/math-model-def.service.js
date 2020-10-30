"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MathModelDefService = void 0;
var core_1 = require("@angular/core");
var MathModelDefService = /** @class */ (function () {
    function MathModelDefService() {
        this.constraintDefs = [];
        this.constraintComps = [];
        this.constraintDefs.push(
        // { constraintType:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'enOffertTrancheLimit', elementType:'enOfferTranche', varType:'enTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'bidTrancheLimit', elementType:'bidTranche', varType:'bidTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'powerFlow', elementType:'branch', varType:'', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'dirBranchLimit', elementType:'branch', varType:'', inEquality:'le', rhsValue:0, rhsProperty:'flowMax', factorValue:1, factorProperty:'' },
        // { constraintType:'objective', elementType:'mathModel', varType:'objectiveVal', inEquality:'eq', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'resOffertTrancheLimit', elementType:'resOfferTranche', varType:'resTrancheCleared', inEquality:'le', rhsValue:0, rhsProperty:'trancheLimit', factorValue:1, factorProperty:'' },
        // { constraintType:'genRiskCalc', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:-1, factorProperty:'' },
        // { constraintType:'islandFindRisk', elementType:'gen', varType:'genRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'islandResCalc', elementType:'island', varType:'islandRes', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        // { constraintType:'resCover', elementType:'island', varType:'islandRisk', inEquality:'le', rhsValue:0, rhsProperty:'', factorValue:1, factorProperty:'' },
        { constraintType: 'nodeBal', elementType: 'bus', varType: '', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'enOffertTrancheLimit', elementType: 'enOfferTranche', varType: 'enTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'bidTrancheLimit', elementType: 'bidTranche', varType: 'bidTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'branch', varType: '', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'dirBranchLimit', elementType: 'branch', varType: '', inEquality: 'le', rhsValue: 0, rhsProperty: 'flowMax', factorValue: 1, factorProperty: '' }, { constraintType: 'objective', elementType: 'mathModel', varType: 'objectiveVal', inEquality: 'eq', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'resOffertTrancheLimit', elementType: 'resOfferTranche', varType: 'resTrancheCleared', inEquality: 'le', rhsValue: 0, rhsProperty: 'trancheLimit', factorValue: 1, factorProperty: '' }, { constraintType: 'genEnResCalc', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'genCapacityMax', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: 'capacityMax', factorValue: 1, factorProperty: '' }, { constraintType: 'islandFindRisk', elementType: 'gen', varType: 'genEnRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'islandResCalc', elementType: 'island', varType: 'islandRes', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', varType: 'islandRisk', inEquality: 'le', rhsValue: 0, rhsProperty: '', factorValue: 1, factorProperty: '' });
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
        // { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'resShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'resShortfallPrice' },
        // { constraintType: 'genRiskCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'genRiskCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' },
        // { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        // { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'resShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' },
        { constraintType: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus', varType: 'branchFlow', factorParentProperty: '', factorValue: -1, factorProperty: 'direction' }, { constraintType: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' }, { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: -1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'bus', propertyMap: 'toBus', varType: 'phaseAnglePos', factorParentProperty: 'susceptance', factorValue: 1, factorProperty: '' }, { constraintType: 'powerFlow', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: 'direction' }, { constraintType: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId', varType: 'branchFlow', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'objective', elementType: 'enOfferTranche', propertyMap: 'all', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'bidTranche', propertyMap: 'all', varType: 'bidTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'resOfferTranche', propertyMap: 'all', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: 'tranchePrice' }, { constraintType: 'objective', elementType: 'island', propertyMap: 'all', varType: 'resShortfall', factorParentProperty: '', factorValue: 1, factorProperty: 'resShortfallPrice' }, { constraintType: 'genEnResCalc', elementType: 'enOfferTranche', propertyMap: 'parentId', varType: 'enTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'genEnResCalc', elementType: 'resOfferTranche', propertyMap: 'parentId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: 1, factorProperty: '' }, { constraintType: 'islandFindRisk', elementType: 'island', propertyMap: 'islandId', varType: 'islandRisk', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'islandResCalc', elementType: 'resOfferTranche', propertyMap: 'islandId', varType: 'resTrancheCleared', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'islandRes', factorParentProperty: '', factorValue: -1, factorProperty: '' }, { constraintType: 'resCover', elementType: 'island', propertyMap: 'self', varType: 'resShortfall', factorParentProperty: '', factorValue: -1, factorProperty: '' });
    }
    // private elementTypeVarTypes: { [elementTypeId: string]: string[] } = {};
    MathModelDefService.prototype.getConstraintDefsAll = function () {
        return this.constraintDefs;
    };
    MathModelDefService.prototype.getConstraintCompsAll = function () {
        return this.constraintComps;
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
