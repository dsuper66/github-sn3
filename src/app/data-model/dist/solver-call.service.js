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
    function SolverCallService(http) {
        this.http = http;
        this.solverURL = 'https://shrouded-escarpment-67155.herokuapp.com/api/solve';
    }
    /** POST: send model to solver */
    SolverCallService.prototype.sendModelToSolver = function (solverInput) {
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json'
            }),
            responseType: 'text'
        };
        return this.http.post(this.solverURL, solverInput.inputJson, httpOptions)
            .pipe(
        //catchError(this.handleError('sendModel', hero))
        );
    };
    SolverCallService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SolverCallService);
    return SolverCallService;
}());
exports.SolverCallService = SolverCallService;
