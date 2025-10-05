import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GefaesstypenList } from './gefaesstypen-list';

describe('GefaesstypenList', () => {
  let component: GefaesstypenList;
  let fixture: ComponentFixture<GefaesstypenList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GefaesstypenList],
    }).compileComponents();

    fixture = TestBed.createComponent(GefaesstypenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
