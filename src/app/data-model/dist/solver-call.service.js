"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SolverCallService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var headers = new http_1.HttpHeaders({
    'Content-Type': 'application/json'
    // Authorization: 'my-auth-token'
});
var SolverCallService = /** @class */ (function () {
    function SolverCallService(http, modelElementDataService, modelElementDefService, mathModelDefService, shapeService) {
        this.http = http;
        this.modelElementDataService = modelElementDataService;
        this.modelElementDefService = modelElementDefService;
        this.mathModelDefService = mathModelDefService;
        this.shapeService = shapeService;
        // solverURL = 'https://shrouded-escarpment-67155.herokuapp.com/api/solve';
        this.solverURL = 'https://scala-solver.herokuapp.com/api/solve';
        this.solverJsonInput = "";
        this.solverResultString = "";
        this.solveInProgress = false;
        this.ipAddress = "";
    }
    SolverCallService.prototype.sendModelToSolver = function (solverInput) {
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json'
            }),
            responseType: 'json'
        };
        return this.http.post(this.solverURL, solverInput.inputJson, httpOptions)
            .pipe(
        //catchError(this.handleError('sendModel', hero))
        );
    };
    SolverCallService.prototype.jsonStart = function (sectionName) {
        return JSON.stringify(sectionName) + ":[";
    };
    SolverCallService.prototype.replaceLastChar = function (stringIn, expectedLastChar, newLastChar) {
        var returnString = stringIn;
        if (stringIn.length > 0) {
            //Check that the last char is what we expect
            if (stringIn.substring(stringIn.length - 1, stringIn.length) === expectedLastChar) {
                //Replace the last char
                returnString = stringIn.substring(0, stringIn.length - 1) + newLastChar;
            }
            else {
                //Add the last char
                returnString = stringIn + newLastChar;
            }
        }
        return returnString;
    };
    SolverCallService.prototype.jsonAddPair = function (key, value) {
        return JSON.stringify(key) + ":" + JSON.stringify(value) + ",";
    };
    SolverCallService.prototype.solveModel = function () {
        var _this = this;
        this.solveInProgress = true;
        //Open JSON
        var jString = "{";
        //Elements
        //Start elements array
        jString += this.jsonStart("elements");
        //Individual Elements    
        var modelElements = this.modelElementDataService.getModelElements();
        //Don't write an element that has missing properties
        var modelElementsExcluded = modelElements.filter(function (element) {
            (Object.keys(element.properties).length
                != _this.modelElementDefService.getPropertyCount(element.elementType));
        });
        //Log what is excluded
        for (var _i = 0, modelElementsExcluded_1 = modelElementsExcluded; _i < modelElementsExcluded_1.length; _i++) {
            var modelElement = modelElementsExcluded_1[_i];
            console.log("###Excluded:" + modelElement.elementId +
                "expected count:" + this.modelElementDefService.getPropertyCount(modelElement.elementType) +
                "but only has ");
            for (var _a = 0, _b = Object.keys(modelElement.properties); _a < _b.length; _a++) {
                var property = _b[_a];
                console.log("key:" + property);
            }
        }
        //==Elements JSON==
        for (var _c = 0, _d = modelElements.filter(function (element) { return element.includeInModel
            && !(modelElementsExcluded.map(function (element) { return element.elementId; }).includes(element.elementId)); }); _c < _d.length; _c++) {
            var modelElement = _d[_c];
            console.log("write: " + modelElement.elementId);
            //Start this Element
            jString += "{";
            //ID
            jString += JSON.stringify("elementId") + ":" + JSON.stringify(modelElement.elementId) + ",";
            //Element type
            jString += JSON.stringify("elementType") + ":" + JSON.stringify(modelElement.elementType) + ",";
            //Properties 
            jString += JSON.stringify("properties") + ":{";
            for (var _e = 0, _f = this.modelElementDefService.getPropertyTypesFor(modelElement.elementType); _e < _f.length; _e++) {
                var propertyType = _f[_e];
                var value = this.modelElementDataService.getValueForElementProperty(modelElement.elementId, propertyType);
                //Don't write undefined values, e.g., tranches with no data
                if (value != undefined) {
                    var stringifiedValue = (this.modelElementDefService.propertyIsString(propertyType)) ? JSON.stringify(value) : JSON.stringify(Number(value));
                    console.log("value:" + value + " stringifiedValue:>" + stringifiedValue + "<");
                    jString += JSON.stringify(propertyType) + ":" + stringifiedValue + ",";
                }
            }
            //Remove the last comma and close properties object
            jString = this.replaceLastChar(jString, ",", "}");
            //Close element object
            jString += "},";
        }
        //Remove last comma and close Elements list
        jString = this.replaceLastChar(jString, ",", "]");
        // jString = jString.substring(0, jString.length - 1) + "]}";
        //Next "object"...  Elements "," ConstraintDefs
        jString += ",";
        //==ConstraintDefs JSON==
        jString += this.jsonStart("constraintDefs");
        var constraintDefs = this.mathModelDefService.getActiveConstraintDefs();
        for (var _g = 0, constraintDefs_1 = constraintDefs; _g < constraintDefs_1.length; _g++) {
            var constraintDef = constraintDefs_1[_g];
            //Start ConstraintDef
            jString += "{";
            jString += this.jsonAddPair("constraintType", constraintDef.constraintType);
            jString += this.jsonAddPair("elementType", constraintDef.elementType);
            jString += this.jsonAddPair("varType", constraintDef.varType);
            jString += this.jsonAddPair("inEquality", constraintDef.inEquality);
            jString += this.jsonAddPair("rhsValue", constraintDef.rhsValue);
            jString += this.jsonAddPair("rhsProperty", constraintDef.rhsProperty);
            jString += this.jsonAddPair("factorValue", constraintDef.factorValue);
            jString += this.jsonAddPair("factorProperty", constraintDef.factorProperty);
            //Remove last comma and close constraintDef object
            jString = this.replaceLastChar(jString, ",", "},");
        }
        //Remove last comma, close constraintDefs list
        jString = this.replaceLastChar(jString, ",", "]");
        //=============
        //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps
        jString += ",";
        //=============
        //==ConstraintComps JSON==
        jString += this.jsonStart("constraintComps");
        var constraintComps = this.mathModelDefService.getActiveConstraintComps();
        for (var _h = 0, constraintComps_1 = constraintComps; _h < constraintComps_1.length; _h++) {
            var constraintComp = constraintComps_1[_h];
            //Start ConstraintComps
            jString += "{";
            jString += this.jsonAddPair("constraintType", constraintComp.constraintType);
            jString += this.jsonAddPair("elementType", constraintComp.elementType);
            jString += this.jsonAddPair("propertyMap", constraintComp.propertyMap);
            jString += this.jsonAddPair("varType", constraintComp.varType);
            jString += this.jsonAddPair("factorParentProperty", constraintComp.factorParentProperty);
            jString += this.jsonAddPair("factorValue", constraintComp.factorValue);
            jString += this.jsonAddPair("factorProperty", constraintComp.factorProperty);
            //Remove last comma and close constraintComp object
            jString = this.replaceLastChar(jString, ",", "},");
        }
        //Remove last comma, close constraintComps list
        jString = this.replaceLastChar(jString, ",", "]");
        //=============
        //Next "object"...  Elements "," ConstraintDefs "," ConstraintComps "," SolverOptions
        jString += ",";
        //=============    
        //==SolverOptions JSON==
        jString += this.jsonStart("solverOptions");
        jString += "{";
        //IP Address
        //jString += this.jsonAddPair("key","ipAddress");
        //jString += this.jsonAddPair("value",this.ipAddress);
        //Dummy
        jString += this.jsonAddPair("key", "dummyKey");
        jString += this.jsonAddPair("value", "dummyValue");
        //Remove last comma and close this solverOption object
        jString = this.replaceLastChar(jString, ",", "},");
        //Remove last comma, close solverOptions list
        jString = this.replaceLastChar(jString, ",", "]");
        //Close JSON
        jString += "}";
        //For display
        this.solverJsonInput = jString;
        //===SOLVE===
        //Send the model to the solver
        //https://stackoverflow.com/questions/50524711/processing-a-complex-object-by-http-get-in-angular-6
        //http://json2ts.com/
        var solverInput = { inputJson: jString };
        this
            .sendModelToSolver(solverInput)
            .subscribe(function (solverResults) {
            //===Extract Results===
            //Save the resultType to the results array for the element
            //where resultType is either varType or constraintType
            //Empty Price and Quantity
            _this.modelElementDataService.resetResults();
            //Variables
            var resultString = "\n";
            for (var _i = 0, _a = solverResults.variables; _i < _a.length; _i++) {
                var modelVar = _a[_i];
                var thisResultString = modelVar.varId + "=" + modelVar.quantity;
                resultString += thisResultString + "\n";
                _this.modelElementDataService.addResult(modelVar.elementId, modelVar.varType, modelVar.varId, modelVar.quantity, "", thisResultString);
            }
            //Constraints
            resultString += "\n\n";
            var constraintString = "\n";
            for (var _b = 0, _c = solverResults.constraints; _b < _c.length; _b++) {
                var modelCon = _c[_b];
                // console.log ("Constraint: Id:" + modelCon.constraintId + " elementId:" + modelCon.elementId);
                var thisResultString = modelCon.constraintId + "=$" + modelCon.shadowPrice;
                resultString += thisResultString + "\n";
                constraintString += modelCon.constraintString + "\n";
                _this.modelElementDataService.addResult(modelCon.elementId, modelCon.constraintType, modelCon.constraintId, modelCon.shadowPrice, modelCon.constraintString, thisResultString);
            }
            //Add the Var and Con results to the shapes
            _this.shapeService.applyResultsToShapesText();
            //Constraint String
            // resultString += "\n\n";
            // for (const modelElement of modelElements) {
            //   modelElement.constraintStrings = [];
            //   for (const modelCon of solverResults.constraints.filter(c => c.elementId == modelElement.elementId)){            
            //     modelElement.constraintStrings.push(modelCon.constraintString);
            //     resultString += modelCon.constraintString;
            //   }
            //   resultString += "\n";
            //   console.log (">>>>>" + modelElement.constraintStrings);
            // }
            //Display the resultString
            //Write to consolve
            console.log("SOLVER RESULTS:" + resultString + constraintString);
            //Show on main display
            _this.solverResultString = resultString + constraintString;
            //Let the component know the solve is done
            _this.solveInProgress = false;
        });
    }; //done solveModel
    SolverCallService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SolverCallService);
    return SolverCallService;
}());
exports.SolverCallService = SolverCallService;
