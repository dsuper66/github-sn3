"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MathModelDataService = void 0;
var core_1 = require("@angular/core");
var MathModelDataService = /** @class */ (function () {
    function MathModelDataService() {
        this.constraintDefs = [];
        this.constraintDefs.push({ constraintId: 'nodeBal', elementType: 'bus', varType: '',
            inEquality: 'eq', rhsProperty: '', rhsVal: 0 }, { constraintId: 'genTrancheLimit', elementType: 'tranche', varType: 'trancheCleared',
            inEquality: 'le', rhsProperty: 'tranchMax', rhsVal: 0 }, { constraintId: 'genSumTranches', elementType: 'gen', varType: 'genCleared',
            inEquality: 'le', rhsProperty: '', rhsVal: 0 }, { constraintId: 'loadTrancheLimit', elementType: 'tranche', varType: 'trancheCleared',
            inEquality: 'le', rhsProperty: 'tranchMax', rhsVal: 0 }, { constraintId: 'loadSumTranches', elementType: 'tranche', varType: 'loadCleared',
            inEquality: 'eq', rhsProperty: '', rhsVal: 0 });
    }
    MathModelDataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], MathModelDataService);
    return MathModelDataService;
}());
exports.MathModelDataService = MathModelDataService;
