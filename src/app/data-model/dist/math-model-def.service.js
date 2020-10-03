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
        this.constraintDefs.push({ constraintId: 'nodeBal', elementType: 'bus',
            varType: '', inEquality: 'eq', rhsProperty: '', rhsValue: 0, multProperty: '' }, { constraintId: 'enOffertTrancheLimit', elementType: 'enOfferTranche',
            varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'trancheLimit', rhsValue: 0, multProperty: '' }, { constraintId: 'bidTrancheLimit', elementType: 'bidTranche',
            varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'trancheLimit', rhsValue: 0, multProperty: '' }, { constraintId: 'powerFlow', elementType: 'dirBranch',
            varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0, multProperty: 'direction' }, { constraintId: 'dirBranchLimit', elementType: 'branch', varType: '', inEquality: 'le', rhsProperty: 'flowMax', rhsValue: 0, multProperty: '' }, { constraintId: 'objective', elementType: 'mathModel',
            varType: 'objectiveVal', inEquality: 'eq', rhsProperty: '', rhsValue: 0, multProperty: '' });
        this.constraintComps.push({ constraintId: 'nodeBal', elementType: 'enOfferTranche', propertyMap: 'toBus',
            varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: '' }, { constraintId: 'nodeBal', elementType: 'bidTranche', propertyMap: 'fromBus',
            varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: '' }, { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMap: 'fromBus',
            varType: 'branchFlow', multParentProperty: '', multValue: -1, multProperty: 'direction' }, { constraintId: 'nodeBal', elementType: 'dirBranch', propertyMap: 'toBus',
            varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: 'direction' }, { constraintId: 'powerFlow', elementType: 'bus', propertyMap: 'fromBus',
            varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1, multProperty: '' }, { constraintId: 'powerFlow', elementType: 'bus', propertyMap: 'toBus',
            varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1, multProperty: '' }, { constraintId: 'dirBranchLimit', elementType: 'dirBranch', propertyMap: 'parentId',
            varType: 'branchFlow', multParentProperty: '', multValue: 1, multProperty: '' }, { constraintId: 'objective', elementType: 'enOfferTranche', propertyMap: 'all',
            varType: 'trancheCleared', multParentProperty: '', multValue: 1, multProperty: 'tranchePrice' }, { constraintId: 'objective', elementType: 'bidTranche', propertyMap: 'all',
            varType: 'trancheCleared', multParentProperty: '', multValue: -1, multProperty: 'tranchePrice' });
    }
    // private elementTypeVarTypes: { [elementTypeId: string]: string[] } = {};
    MathModelDefService.prototype.getConstraintDefs = function () {
        return this.constraintDefs;
    };
    MathModelDefService.prototype.getConstraintComps = function () {
        return this.constraintComps;
    };
    MathModelDefService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MathModelDefService);
    return MathModelDefService;
}());
exports.MathModelDefService = MathModelDefService;
