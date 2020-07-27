import { Injectable } from '@angular/core';
import { ModelElement} from './model-element';

@Injectable({
  providedIn: 'root'
})
export class ModelElementService {

  constructor() { }

  private modelElements:ModelElement[]=[];

  
}
