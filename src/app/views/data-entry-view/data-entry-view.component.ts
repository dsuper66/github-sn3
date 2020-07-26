import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-data-entry-view',
  templateUrl: './data-entry-view.component.html',
  styleUrls: ['./data-entry-view.component.css']
})
export class DataEntryViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  favoriteColorControl = new FormControl('');

}

// export class FavoriteColorComponent {
//   favoriteColorControl = new FormControl('');

// }
