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
        //Constraint Defs
        this.constraintDefs.push({ constraintId: 'nodeBal', elementType: 'bus', varType: '', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }, { constraintId: 'genTrancheLimit', elementType: 'genTranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 }, { constraintId: 'genSumTranches', elementType: 'gen', varType: 'genCleared', inEquality: 'le', rhsProperty: '', rhsValue: 0 }, { constraintId: 'loadTrancheLimit', elementType: 'loadTranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 }, { constraintId: 'loadSumTranches', elementType: 'load', varType: 'loadCleared', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }, { constraintId: 'powerFlow', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }, { constraintId: 'brFlowLimit', elementType: 'branch', varType: 'nil', inEquality: 'le', rhsProperty: 'flowMax', rhsValue: 0 }, { constraintId: 'flowSumDirs', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }, { constraintId: 'angleSumDirs', elementType: 'bus', varType: 'phaseAngle', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }, { constraintId: 'objective', elementType: 'model', varType: 'objectiveVal', inEquality: 'eq', rhsProperty: '', rhsValue: 0 });
        //Constraint Components
        this.constraintComps.push({ constraintId: 'nodeBal', elementType: 'gen', propertyMapToParent: 'toBus',
            varType: 'genCleared', multParentProperty: '', multValue: 1 }, { constraintId: 'nodeBal', elementType: 'load', propertyMapToParent: 'fromBus',
            varType: 'loadCleared', multParentProperty: '', multValue: -1 }, { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'fromBus',
            varType: 'branchFlow', multParentProperty: '', multValue: -1 }, { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'toBus',
            varType: 'branchFlow', multParentProperty: '', multValue: 1 }, { constraintId: 'genSumTranches', elementType: 'genTranche', propertyMapToParent: 'parentId',
            varType: 'trancheCleared', multParentProperty: '', multValue: -1 }, { constraintId: 'loadSumTranches', elementType: 'loadTranche', propertyMapToParent: 'parentId',
            varType: 'trancheCleared', multParentProperty: '', multValue: -1 }, { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'fromBus',
            varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1 }, { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'toBus',
            varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1 }, { constraintId: 'branchLimit', elementType: 'dirBranch', propertyMapToParent: 'parentId',
            varType: 'branchFlow', multParentProperty: '', multValue: 0 }, { constraintId: 'brFlowSumDirs', elementType: 'dirFlowFwd', propertyMapToParent: 'parentId',
            varType: 'branchFlow', multParentProperty: '', multValue: -1 }, { constraintId: 'brFlowSumDirs', elementType: 'dirFlowRev', propertyMapToParent: 'parentId',
            varType: 'branchFlow', multParentProperty: '', multValue: 1 }, { constraintId: 'angleSumDirs', elementType: 'dirAngleFwd', propertyMapToParent: 'parentId',
            varType: 'phaseAngle', multParentProperty: '', multValue: -1 }, { constraintId: 'angleSumDirs', elementType: 'dirAngleRev', propertyMapToParent: 'parentId',
            varType: 'phaseAngle', multParentProperty: '', multValue: 1 }, { constraintId: 'objective', elementType: 'genTranche', propertyMapToParent: 'genPrice',
            varType: 'trancheCleared', multParentProperty: '', multValue: -1 }, { constraintId: 'objective', elementType: 'loadTranche', propertyMapToParent: 'loadPrice',
            varType: 'trancheCleared', multParentProperty: '', multValue: 1 });
        //Variables for Element Types
        // this.elementTypeVarTypes['bus'] =         ['phaseAngle'];
        // this.elementTypeVarTypes['posAngle'] =    ['phaseAngle'];
        // this.elementTypeVarTypes['negAngle'] =    ['phaseAngle'];
        // this.elementTypeVarTypes['branch'] =      ['branchFlow','branchLoss'];
        // this.elementTypeVarTypes['posFlow'] =     ['branchFlow','branchLoss'];
        // this.elementTypeVarTypes['negFlow'] =     ['branchFlow','branchLoss'];
        // this.elementTypeVarTypes['gen'] =         ['genCleared','resCleared'];
        // this.elementTypeVarTypes['load'] =        ['loadCleared'];
        // this.elementTypeVarTypes['genTranche'] =  ['trancheCleared'];
        // this.elementTypeVarTypes['loadTranche'] = ['trancheCleared'];
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
