import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkBuilderViewComponent } from './network-builder-view.component';

describe('NetworkBuilderViewComponent', () => {
  let component: NetworkBuilderViewComponent;
  let fixture: ComponentFixture<NetworkBuilderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkBuilderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkBuilderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
