import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathModelDataService {

  constructor() { 

    this.constraintDefs.push(
      { constraintId: 'nodeBal', elementType: 'bus', varType: '', 
        inEquality: 'eq', rhsProperty: '', rhsVal: 0 },
      { constraintId: 'genTrancheLimit', elementType: 'tranche', varType: 'trancheCleared', 
        inEquality: 'le', rhsProperty: 'tranchMax', rhsVal: 0 },
      { constraintId: 'genSumTranches', elementType: 'gen', varType: 'genCleared', 
        inEquality: 'le', rhsProperty: '', rhsVal: 0 },
      { constraintId: 'loadTrancheLimit', elementType: 'tranche', varType: 'trancheCleared', 
        inEquality: 'le', rhsProperty: 'tranchMax', rhsVal: 0 },
      { constraintId: 'loadSumTranches', elementType: 'tranche', varType: 'loadCleared', 
        inEquality: 'eq', rhsProperty: '', rhsVal: 0 }
    )
  }

  private constraintDefs: ConstraintDef[] = [];


}



export interface ConstraintDef {
  constraintId: string;
  elementType: string;
  varType: string;
  inEquality: string;
  rhsProperty: string;  
  rhsVal: number;
}


export interface ConstraintComp {
  constraintId: string;
  parentProperty: string;  
  elementType: string;
  varType: string;
  multiplier: number;
}
