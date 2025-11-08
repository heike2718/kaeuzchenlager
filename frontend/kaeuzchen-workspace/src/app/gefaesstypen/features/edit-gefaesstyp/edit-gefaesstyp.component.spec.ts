import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditGefaesstypComponent } from './edit-gefaesstyp.component';

describe('EditGefaesstypComponent', () => {
  let component: EditGefaesstypComponent;
  let fixture: ComponentFixture<EditGefaesstypComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGefaesstypComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditGefaesstypComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
