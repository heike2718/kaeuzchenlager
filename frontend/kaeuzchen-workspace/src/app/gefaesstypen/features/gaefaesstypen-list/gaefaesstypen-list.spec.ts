import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaefaesstypenList } from './gaefaesstypen-list';

describe('GaefaesstypenList', () => {
  let component: GaefaesstypenList;
  let fixture: ComponentFixture<GaefaesstypenList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaefaesstypenList],
    }).compileComponents();

    fixture = TestBed.createComponent(GaefaesstypenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
