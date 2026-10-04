import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchStudents } from './search-students';

describe('SearchStudents', () => {
  let component: SearchStudents;
  let fixture: ComponentFixture<SearchStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStudents],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
