import { Component, OnInit } from '@angular/core';

import { ShapeService } from '../shape.service';
import {ModelElementService} from '../../data-model/model-element.service';
import { Shape } from '../shape';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  constructor(private shapeService: ShapeService) { }

  private shapes:Shape[]=[];

  ngOnInit(): void {
    this.getShapeData();
  }

  getShapeData() {
    this.shapes = this.shapeService.getShapes();
    for (let shape of this.shapes) {
      console.log(JSON.stringify({ name: shape.elementId, age: shape.busId1 }));
    }
  }
}
