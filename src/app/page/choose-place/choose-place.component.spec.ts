import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePlaceComponent } from './choose-place.component';

describe('ChoosePlaceComponent', () => {
  let component: ChoosePlaceComponent;
  let fixture: ComponentFixture<ChoosePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosePlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
