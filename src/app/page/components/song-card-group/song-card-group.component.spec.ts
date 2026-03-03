import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCardGroupComponent } from './song-card-group.component';

describe('SongCardGroupComponent', () => {
  let component: SongCardGroupComponent;
  let fixture: ComponentFixture<SongCardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCardGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
