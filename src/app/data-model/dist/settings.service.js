"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SettingsService = void 0;
var core_1 = require("@angular/core");
var SettingsService = /** @class */ (function () {
    function SettingsService() {
        //Settings
        this.settings = {};
        //this.settings["sampleSetting"] = false;
    }
    //https://jessitron.com/2017/07/18/dictionary-objects-in-javascript-and-typescript/
    SettingsService.prototype.getAllSettingIds = function () {
        return Object.keys(this.settings);
    };
    SettingsService.prototype.getStatus = function (settingId) {
        return this.settings[settingId];
    };
    SettingsService.prototype.setStatus = function (settingId, isEnabled) {
        this.settings[settingId] = isEnabled;
    };
    SettingsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
