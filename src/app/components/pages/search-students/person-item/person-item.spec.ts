import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonItem } from './person-item';

describe('Person', () => {
  let component: PersonItem;
  let fixture: ComponentFixture<PersonItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonItem],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
