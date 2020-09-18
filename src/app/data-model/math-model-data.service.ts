import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDataService {

  constructor() {

    //Constraints
    this.constraintDefs.push(
      { constraintId:'nodeBal', elementType:'bus', varType:'', inEquality:'eq', rhsProperty:'', rhsValue:0 },
      { constraintId: 'genTrancheLimit', elementType: 'tranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 },
      { constraintId: 'genSumTranches', elementType: 'gen', varType: 'genCleared', inEquality: 'le', rhsProperty: '', rhsValue: 0 },
      { constraintId: 'loadTrancheLimit', elementType: 'tranche', varType: 'trancheCleared', inEquality: 'le', rhsProperty: 'tranchMax', rhsValue: 0 },
      { constraintId: 'loadSumTranches', elementType: 'tranche', varType: 'loadCleared', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      { constraintId: 'powerFlow', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      { constraintId: 'brFlowLimit', elementType: 'branch', varType: 'nil', inEquality: 'le', rhsProperty: 'flowMax', rhsValue: 0 },
      { constraintId: 'flowSumDirs', elementType: 'branch', varType: 'branchFlow', inEquality: 'eq', rhsProperty: '', rhsValue: 0 },
      { constraintId: 'angleSumDirs', elementType: 'bus', varType: 'phaseAngle', inEquality: 'eq', rhsProperty: '', rhsValue: 0 }
    )

    //Constraint Components
    this.constraintComps.push(
      { constraintId: 'nodeBal', elementType: 'gen', propertyMapToParent: 'toBus', varType: 'genCleared', multParentProperty: '', multValue: 1 },
      { constraintId: 'nodeBal', elementType: 'load', propertyMapToParent: 'fromBus', varType: 'loadCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'fromBus', varType: 'flowCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'nodeBal', elementType: 'branch', propertyMapToParent: 'toBus', varType: 'flowCleared', multParentProperty: '', multValue: 1 },
      { constraintId: 'genSumTranches', elementType: 'genTranche', propertyMapToParent: 'parentId', varType: 'trancheCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'loadSumTranches', elementType: 'loadTranche', propertyMapToParent: 'parentId', varType: 'trancheCleared', multParentProperty: '', multValue: -1 },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'fromBus', varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: -1 },
      { constraintId: 'powerFlow', elementType: 'bus', propertyMapToParent: 'toBus', varType: 'phaseAngle', multParentProperty: 'susceptance', multValue: 1 },
      { constraintId: 'branchLimit', elementType: 'dirBranch', propertyMapToParent: 'parentId', varType: 'branchFlow', multParentProperty: '', multValue: 0 },
      { constraintId: 'brFlowSumDirs', elementType: 'dirFlowFwd', propertyMapToParent: 'parentId', varType: 'branchFlow', multParentProperty: '', multValue: -1 },
      { constraintId: 'brFlowSumDirs', elementType: 'dirFlowRev', propertyMapToParent: 'parentId', varType: 'branchFlow', multParentProperty: '', multValue: 1 },
      { constraintId: 'angleSumDirs', elementType: 'dirAngleFwd', propertyMapToParent: 'parentId', varType: 'phaseAngle', multParentProperty: '', multValue: -1 },
      { constraintId: 'angleSumDirs', elementType: 'dirAngleRev', propertyMapToParent: 'parentId', varType: 'phaseAngle', multParentProperty: '', multValue: 1 }
    )
  }

  private constraintDefs: ConstraintDef[] = [];
  private constraintComps: ConstraintComp[] = [];

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
