import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDefService {

  constructor() {

    //Constraint Defs
    this.constraintDefs.push(
      // { constraintId: 'nodeBal', elementType: 'bus', varType: '', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'enOfferTrancheLimit', elementType: 'enOfferTranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 },
      // { constraintId: 'genSumTranches', elementType: 'gen', varType: 'genCleared', inEquality: 'le', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'bidTrancheLimit', elementType: 'bidTranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 },
      // { constraintId: 'loadSumTranches', elementType: 'load', varType: 'loadCleared', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'powerFlow', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'brFlowLimit', elementType: 'branch', varType: 'nil', inEquality: 'le', rhsProperty: 'flowMax', rhsValue: 0 },
      // { constraintId: 'flowSumDirs', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'angleSumDirs', elementType: 'bus', varType: 'phaseAngle', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      // { constraintId: 'objective', elementType: 'model', varType: 'objectiveVal', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }

      {
        constraintId: 'nodeBal', elementType: 'bus',
        varType: '', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'enOfferTrancheLimit', elementType: 'enOfferTranche',
        varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'enOfferTrancheLimit', rhsValue: 0
      },
      {
        constraintId: 'enOfferTrancheSum', elementType: 'gen',
        varType: 'genCleared', inEquality: 'le', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'bidTrancheLimit', elementType: 'bidTranche',
        varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'bidTrancheLimit', rhsValue: 0
      },
      {
        constraintId: 'bidTrancheSum', elementType: 'load',
        varType: 'loadCleared', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'powerFlow', elementType: 'branch',
        varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'brDirFlowLimit', elementType: 'branch',
        varType: '', inEquality: 'le', rhsProperty: 'flowMax', rhsValue: 0
      },
      {
        constraintId: 'brDirFlowSum', elementType: 'branch',
        varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'angleSumDirs', elementType: 'bus',
        varType: 'phaseAngle', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'riskCalc', elementType: 'pwrSystem',
        varType: 'genRisk', inEquality: 'le', rhsProperty: '', rhsValue: 0
      },
      {
        constraintId: 'objective', elementType: 'model',
        varType: 'objectiveVal', inEquality: 'eq', rhsProperty: '', rhsValue: 0
      }

    )

    //Constraint Components
    this.constraintComps.push(
      { constraintId: 'nodeBal', elementType: 'gen', propertyMapToParent: 'toBus', 
        varType: 'genCleared', multParentProperty: '', multValue: 1 },
      { constraintId: 'nodeBal', elementType: 'load', propertyMapToParent: 'fromBus', 
        varType: 'loadCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'fromBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: -1 },
      { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'toBus', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1 },
      { constraintId: 'enOfferTrancheSum', elementType: 'enOfferTranche', propertyMapToParent: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'bidTrancheSum', elementType: 'bidTranche', propertyMapToParent: 'parentId', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'fromBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1 },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'toBus', 
        varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1 },
      { constraintId: 'brDirFlowLimit', elementType: 'dirBranch', propertyMapToParent: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 0 },
      { constraintId: 'brDirFlowSum', elementType: 'dirFlowFwd', propertyMapToParent: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: -1 },
      { constraintId: 'brDirFlowSum', elementType: 'dirFlowRev', propertyMapToParent: 'parentId', 
        varType: 'branchFlow', multParentProperty: '', multValue: 1 },
      { constraintId: 'angleSumDirs', elementType: 'dirAngleFwd', propertyMapToParent: 'parentId', 
        varType: 'phaseAngle', multParentProperty: '', multValue: -1 },
      { constraintId: 'angleSumDirs', elementType: 'dirAngleRev', propertyMapToParent: 'parentId', 
        varType: 'phaseAngle', multParentProperty: '', multValue: 1 },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMapToParent: 'pwrSystem', 
        varType: 'genCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'riskCalc', elementType: 'gen', propertyMapToParent: 'pwrSystem', 
        varType: 'resCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'objective', elementType: 'genTranche', propertyMapToParent: 'genPrice', 
        varType: 'trancheCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'objective', elementType: 'loadTranche', propertyMapToParent: 'loadPrice', 
        varType: 'trancheCleared', multParentProperty: '', multValue: 1 }
    )

    //Variables for Element Types
    // this.elementTypeVarTypes['bus'] =         ['phaseAngle'];
    // this.elementTypeVarTypes['posAngle'] =    ['phaseAngle'];
    // this.elementTypeVarTypes['negAngle'] =    ['phaseAngle'];
    // this.elementTypeVarTypes['branch'] =      ['branchFlow','branchLoss'];
    // this.elementTypeVarTypes['posFlow'] =     ['branchFlow','branchLoss'];
    // this.elementTypeVarTypes['negFlow'] =     ['branchFlow','branchLoss'];
    // this.elementTypeVarTypes['gen'] =         ['genCleared','resCleared'];
    // this.elementTypeVarTypes['load'] =        ['loadCleared'];

    // this.elementTypeVarTypes['enOfferTranche'] =  ['trancheCleared'];
    // this.elementTypeVarTypes['bidTranche'] = ['trancheCleared'];

  }


  private constraintDefs: ConstraintDef[] = [];
  private constraintComps: ConstraintComp[] = [];
  // private elementTypeVarTypes: { [elementTypeId: string]: string[] } = {};

  getConstraintDefs() {
    return this.constraintDefs;
  }

  getConstraintComps() {
    return this.constraintComps;
  }

}


export interface ConstraintDef {
  constraintId: string;
  elementType: string;
  varType: string;
  inEquality: string;
  rhsProperty: string;
  rhsValue: number;
}


export interface ConstraintComp {
  constraintId: string;
  elementType: string;
  propertyMapToParent: string;
  varType: string;
  multParentProperty: string;
  multValue: number;
}
