import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomFormControl } from './custom-form-control';

describe('CustomFormControl', () => {
  let component: CustomFormControl;
  let fixture: ComponentFixture<CustomFormControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFormControl],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFormControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
