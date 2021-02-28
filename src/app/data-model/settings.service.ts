import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { 
    //this.settings["sampleSetting"] = false;
  }

  //Settings
  private settings: {[settingId:string] : boolean} = {};
  //https://jessitron.com/2017/07/18/dictionary-objects-in-javascript-and-typescript/
  getAllSettingIds(): string[] {
    return Object.keys(this.settings);
  }
  getStatus(settingId: string) {
    return this.settings[settingId];
  }
  setStatus(settingId: string, isEnabled: boolean) {
    this.settings[settingId] = isEnabled;
  }
}
